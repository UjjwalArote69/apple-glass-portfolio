async function check() {
  const res = await fetch('https://nari-astra.vercel.app/assets/index-BzN-wZ7j.js');
  const js = await res.text();
  const headings = js.match(/["']([A-Z][a-zA-Z0-9\s]{4,40})["']/g);
  console.log('Sample text:', headings ? headings.slice(20, 45) : 'None');
}
check();
