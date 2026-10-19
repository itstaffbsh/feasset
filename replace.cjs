const fs = require('fs')
const path = require('path')

function walk(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach(file => {
    file = path.join(dir, file)
    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file))
    } else { 
      if (file.endsWith('.vue') || file.endsWith('.ts') || file.endsWith('.js')) {
        results.push(file)
      }
    }
  })
  return results
}

const files = walk('pages')

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8')
  // We want to replace await useApiFetch(..., { method: 'POST' ... })
  // Actually, any useApiFetch with a method other than default (GET) should probably be $api.
  // We can just regex replace `await useApiFetch` if it is followed by method: 'POST', 'DELETE', 'PUT'
  // But wait, $api needs to be explicitly imported? No, it's a Nuxt auto-imported composable!
  let modified = content.replace(/await useApiFetch\(([^)]+method:\s*['"](?:POST|PUT|DELETE)['"][^)]*)\)/g, 'await $api($1)')
  
  if (modified !== content) {
    fs.writeFileSync(f, modified)
    console.log(`Updated ${f}`)
  }
})
