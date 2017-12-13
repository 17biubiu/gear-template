





export default path => r => require.ensure([], () =>
r(require(`./${path}.md`)),
'doc-map');

