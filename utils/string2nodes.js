export function stringToNodes(keyword,value) {
  const nodes = [];
  if(value.toUpperCase().startsWith(keyword.toUpperCase())) {
    const key1 = value.slice(0,keyword.length)
    const key2 = value.slice(keyword.length)
    const node1 = {
      name: "span",
      attrs: {
        class: "item",
        style: "color: red;"
      },
      children: [
        {
          type: "text",
          text: key1
        }
      ]
    }
    const node2 = {
      name: "span",
      attrs: {
        class: "item",
      },
      children: [
        {
          type: "text",
          text: key2
        }
      ]
    }
    nodes.push(node1,node2)
  } else {
    nodes.push({
      name: "span",
      children: [
        {
          type: "text",
          text: value
        }
      ]
    })
  }
  return nodes;
}