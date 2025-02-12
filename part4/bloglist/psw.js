const bcryptjs = require('bcryptjs')

const f = async () => {
  console.log('ae', await bcryptjs.hash('Relativitätstheorie', 10))
  console.log('mc', await bcryptjs.hash('Radioactivité', 10))
  console.log('sh', await bcryptjs.hash('Black Hole', 10))
  console.log('nb', await bcryptjs.hash('Kvantemekanik', 10))
}
f()