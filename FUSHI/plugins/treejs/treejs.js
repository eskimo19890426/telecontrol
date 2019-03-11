let Treejs = {}
// 遍历树
Treejs.each = function(tree, call, from, to) {
  // 判断选用局部遍历还是全部遍历
  from && to ? Treejs.eachRange(tree, call, from, to) : Treejs.eachAll(tree, call)
}
// 遍历全部
Treejs.eachAll = function(tree, call, par) {
  // par 父亲
  let parent = {
    item: '',
    level: 0
  }
  // 如果父亲有值就继承
  par ? parent = par : ''
  if ((typeof tree === 'object') && (tree.constructor === Object.prototype.constructor)) {
    var arrey = []
    arrey.push(tree)
  } else arrey = tree
  for (var f in tree) {
    var item = arrey[f]
    // 判断是否有_idx 如果没有则给它加上用来后面做树的优化的
    if (!item._idx) {
      item._idx = []
      item._idxstr = ''
      if (parent.item) {
        for (let pidx of parent.item._idx) {
          item._idx.push(pidx)
          let idxstr = ''
          Number(pidx) < 100 ? idxstr = '0' + pidx : ''
          Number(pidx) < 10 ? idxstr = '00' + pidx : ''
          item._idxstr += idxstr + '.'
        }
      }
      item._idx.push(f)
      let idxstr = ''
      Number(f) < 100 ? idxstr = '0' + f : ''
      Number(f) < 10 ? idxstr = '00' + f : ''
      item._idxstr += idxstr
    }
    if (typeof call === 'function') {
      call(item)
    }
    if (item.children && item.children.length > 0) {
      Treejs.eachAll(item.children, call, {
        item: item,
        level: parent.level + 1
      })
    }
  }
}

// 遍历部分范围
Treejs.eachRange = function(tree, call, from, to) {
  if ((typeof tree === 'object') && (tree.constructor === Object.prototype.constructor)) {
    var arrey = []
    arrey.push(tree)
  } else arrey = tree
  for (var f in tree) {
    var item = arrey[f]
    // 判断位置
    let start = ''
    let skip = false
    for (let i in item._idx) {
      if (Number(item._idx[i]) < Number(from[i])) {
        start += '0,'
      }
      if (Number(item._idx[i]) === Number(from[i])) {
        start += '1,'
      }
      if (Number(item._idx[i]) > Number(from[i])) {
        start += '2,'
      }
    }
    // 0开头的都是小于起始位置的需要跳过
    if (start.indexOf('0,') === 0) {
      continue
    }
    if (start.indexOf('0') === -1 && start.indexOf('2') === -1 && item._idx.length < from.length) {
      skip = true
    }
    if (start.indexOf('1') >= 0 && start.indexOf('0') >= 0 && start.indexOf('2') === -1) {
      continue
    }
    // console.log('start', start)
    if (typeof call === 'function' && !skip) {
      console.log('起始位置', from, '当前位置', item._idx, '结束位置', to)
      call(item)
    }
    // 判断是否结束
    let end = ''
    for (let i in item._idx) {
      let itemIdx = Number(item._idx[i])
      let toIdx = Number(to[i])
      if (itemIdx >= toIdx) {
        end += '1,'
      } else {
        end += '0,'
      }
    }
    if (item.children && item.children.length > 0) {
      Treejs.eachRange(item.children, call, from, to)
    }
    if (end.indexOf('0') === -1) {
      break
    }
  }
}

// 通过位置获取树的对象
Treejs.getByIdx = function(data, idx, call) {
  let row = data[Number(idx[0])]
  let child = row.children
  if (child && idx.length > 1) {
    let nidx = JSON.stringify(idx)
    nidx = JSON.parse(nidx).splice(1, idx.length)
    Treejs.getByIdx(child, nidx, call)
  } else if (typeof call === 'function') {
    call(row)
  }
}

// 混入字段用于数据结构不对的时候将其进行转换
Treejs.mixAttr = function(tree, attr) {
  Treejs.each(tree, obj => {
    for (var val of attr) {
      let map = val.split('=')
      obj[map[0]] = obj[map[1]]
    }
  })
}

export default Treejs
