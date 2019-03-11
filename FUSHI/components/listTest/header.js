export default {
  name: 'TableRenderHeader',
  functional: true,
  props: {
    renders: Function,
    column: Object,
    index: Number
  },
  render: (h, ctx) => {
    return ctx.props.renders(h)
    // const params = {
    //   column: ctx.props.column,
    //   index: ctx.props.index
    // }
    // return ctx.props.render(h, params)
  }
}
