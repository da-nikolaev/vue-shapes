<template>
  <div class="vue-shapes-h100 vue-shapes-w100">
    <svg class="vue-shapes-h100 vue-shapes-w100 vue-shapes-svg">
      <component
        v-for="node in nodes"
        v-bind:is="node.group"
        v-bind:key="node.id"
        v-bind:data="node"
        :ref="node.id"
      />
      <vue-shapes-path v-for="edge in computedEdges" v-bind:key="edge.id" v-bind:data="edge" />
    </svg>
    <VsScale />
  </div>
</template>
<script>
import VsScale from "./VsScale";
import Path from "./shapes/Path";

export default {
  props: ["nodes", "edges"],
  data: function() {
    return {
      dragging: [],
      scale: 1.0,
      computedEdges: []
    };
  },
  mounted: function() {
    this.$nextTick(() => {
      var svg = this.$el.firstElementChild;

      svg.addEventListener("mousedown", e => this.startDrag(e));
      svg.addEventListener("mousemove", e => this.drag(e));
      svg.addEventListener("mouseup", e => this.endDrag(e));
      svg.addEventListener("mouseleave", e => this.endDrag(e));
      svg.addEventListener("touchstart", e => this.startDrag(e));
      svg.addEventListener("touchmove", e => this.drag(e));
      svg.addEventListener("touchend", e => this.endDrag(e));
      svg.addEventListener("touchleave", e => this.endDrag(e));
      svg.addEventListener("touchcancel", e => this.endDrag(e));
      svg.addEventListener("wheel", e => this.zoom(e));
    });
  },
  methods: {
    getMousePosition: function(evt) {
      let CTM = this.$el.firstElementChild.getScreenCTM();

      if (evt.touches) {
        evt = evt.touches[0];
      }
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
      };
    },
    getOrCreateTransformation: function(transforms, type) {
      const len = transforms.length || transforms.numberOfItems;
      let translate = null;
      let scale = null;
      let matrix = null;
      for (let i = 0; i < len; i++) {
        if (transforms.getItem(i).type == SVGTransform.SVG_TRANSFORM_SCALE) {
          scale = transforms.getItem(i);
        }
        if (
          transforms.getItem(i).type == SVGTransform.SVG_TRANSFORM_TRANSLATE
        ) {
          translate = transforms.getItem(i);
        }
        if (transforms.getItem(i).type == SVGTransform.SVG_TRANSFORM_MATRIX) {
          matrix = transforms.getItem(i);
        }
      }
      if (!translate) {
        translate = this.$el.firstElementChild.createSVGTransform();
        translate.setTranslate(0, 0);
        transforms.insertItemBefore(translate, 0);
      }
      if (!scale) {
        scale = this.$el.firstElementChild.createSVGTransform();
        scale.setScale(1.0, 1.0);
        transforms.insertItemBefore(scale, 0);
      }
      if (!matrix) {
        matrix = this.$el.firstElementChild.createSVGTransform();
        transforms.insertItemBefore(matrix, 0);
      }

      switch (type) {
        case SVGTransform.SVG_TRANSFORM_MATRIX:
          return matrix;
        case SVGTransform.SVG_TRANSFORM_SCALE:
          return scale;
        case SVGTransform.SVG_TRANSFORM_TRANSLATE:
          return translate;
        default:
          return null;
      }
    },
    startDrag: function(evt) {
      let createDragging = element => {
        let d = {};
        d.element = element;
        d.offset = this.getMousePosition(evt);
        d.offset.x = d.offset.x / this.scale;
        d.offset.y = d.offset.y / this.scale;

        let transforms = d.element.transform.baseVal;
        let transform = this.getOrCreateTransformation(
          transforms,
          SVGTransform.SVG_TRANSFORM_TRANSLATE
        );
        d.transform = transform;
        d.offset.x -= d.transform.matrix.e;
        d.offset.y -= d.transform.matrix.f;
        return d;
      };

      this.dragging = [];
      if (evt.target.getAttribute("draggable")) {
        this.dragging.push(createDragging(evt.target));
      } else if (evt.target == this.$el.firstElementChild) {
        for (let i = 0; i < this.$el.firstElementChild.children.length; i++) {
          const child = this.$el.firstElementChild.children.item(i);
          this.dragging.push(createDragging(child));
        }
      }
    },
    drag: function(evt) {
      this.dragging.forEach(d => {
        evt.preventDefault();
        let coord = this.getMousePosition(evt);
        if (d.element.getAttribute("not-draggable")) {
          return;
        }
        d.transform.setTranslate(
          coord.x / this.scale - d.offset.x,
          coord.y / this.scale - d.offset.y
        );
        d.element.setAttribute("tx", coord.x / this.scale - d.offset.x);
        d.element.setAttribute("ty", coord.y / this.scale - d.offset.y);

        if (!this.computedEdges.length) {
          this.computedEdges.push({
            x1: 0,
            y1: 0,
            x2: 100,
            y2: 100,
            x3: 400,
            y3: 100,
            x4: 500,
            y4: 0
          });
        }

        let nearestSlots = list => {
          let result = list.map(ll => {
            return {
              distance: Math.sqrt(
                Math.pow(ll[1].x1 - ll[0].x1, 2) +
                  Math.pow(ll[1].y1 - ll[0].y1, 2)
              ),
              slot1: ll[0].slot,
              slot2: ll[1].slot
            };
          });
          let sorted = result.sort((l, r) => l.distance - r.distance);

          return sorted[0];
        };
        let add = (slot, x, y) => {
          return {
            x1: slot.x1 + x,
            y1: slot.y1 + y,
            slot: slot
          };
        };

        let slots = nearestSlots([
          [
            add(
              this.$refs["1"][0].getSlots()[0],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[0],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[0],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[1],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[0],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[2],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[0],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[3],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[1],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[0],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[1],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[1],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[1],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[2],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[1],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[3],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[2],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[0],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[2],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[1],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[2],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[2],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[2],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[3],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[3],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[0],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[3],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[1],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[3],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[2],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ],
          [
            add(
              this.$refs["1"][0].getSlots()[3],
              this.$refs["1"][0].data.x +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["1"][0].data.y +
                parseInt(
                  this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            ),
            add(
              this.$refs["2"][0].getSlots()[3],
              this.$refs["2"][0].data.x +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") ||
                    0
                ),
              this.$refs["2"][0].data.y +
                parseInt(
                  this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") ||
                    0
                )
            )
          ]
        ]);

        let slot1 = slots.slot1;
        let slot2 = slots.slot2;
        this.computedEdges[0].x1 =
          this.$refs["1"][0].data.x +
          parseInt(
            this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") || 0
          ) +
          slot1.x1;
        this.computedEdges[0].y1 =
          this.$refs["1"][0].data.y +
          parseInt(
            this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") || 0
          ) +
          slot1.y1;
        this.computedEdges[0].x2 =
          this.$refs["1"][0].data.x +
          parseInt(
            this.$refs["1"][0].$el.firstElementChild.getAttribute("tx") || 0
          ) +
          slot1.x2;
        this.computedEdges[0].y2 =
          this.$refs["1"][0].data.y +
          parseInt(
            this.$refs["1"][0].$el.firstElementChild.getAttribute("ty") || 0
          ) +
          slot1.y2;
        this.computedEdges[0].x3 =
          this.$refs["2"][0].data.x +
          parseInt(
            this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") || 0
          ) +
          slot2.x2;
        this.computedEdges[0].y3 =
          this.$refs["2"][0].data.y +
          parseInt(
            this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") || 0
          ) +
          slot2.y2;
        this.computedEdges[0].x4 =
          this.$refs["2"][0].data.x +
          parseInt(
            this.$refs["2"][0].$el.firstElementChild.getAttribute("tx") || 0
          ) +
          slot2.x1;
        this.computedEdges[0].y4 =
          this.$refs["2"][0].data.y +
          parseInt(
            this.$refs["2"][0].$el.firstElementChild.getAttribute("ty") || 0
          ) +
          slot2.y1;
      });
    },
    endDrag: function(evt) {
      this.dragging = [];
    },
    zoom: function(evt) {
      evt.preventDefault();

      let pos = this.getMousePosition(evt);
      if (evt.deltaY > 0) {
        this.zoomIn(pos);
      } else {
        this.zoomOut(pos);
      }
    },
    zoomIn: function(pos) {
      this.scale += 0.01;
      this.updateScale(pos || { x: 0, y: 0 });
    },
    zoomOut: function(pos) {
      this.scale -= 0.01;
      if (this.scale <= 0.1) {
        this.scale = 0.1;
      }
      this.updateScale(pos || { x: 0, y: 0 });
    },
    zoomFit: function() {},
    updateScale: function(pos) {
      for (let i = 0; i < this.$el.firstElementChild.children.length; i++) {
        const child = this.$el.firstElementChild.children.item(i);
        let transforms = child.transform.baseVal;
        let transform = this.getOrCreateTransformation(
          transforms,
          SVGTransform.SVG_TRANSFORM_MATRIX
        );

        transform.matrix.a = this.scale;
        transform.matrix.c = 0;
        transform.matrix.e = (1 - this.scale) * pos.x;
        transform.matrix.b = 0;
        transform.matrix.d = this.scale;
        transform.matrix.f = (1 - this.scale) * pos.y;
        child.setAttribute("sx", transform.matrix.e);
        child.setAttribute("sy", transform.matrix.f);
      }
    }
  },
  components: {
    "vue-shapes-path": Path,
    VsScale
  }
};
</script>
<style scoped>
.vue-shapes-h100 {
  height: 100%;
}
.vue-shapes-w100 {
  width: 100%;
}
.vue-shapes-svg {
  background-image: url("../images/background.png");
}
</style>