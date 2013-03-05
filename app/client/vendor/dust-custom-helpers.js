// expects {@date format="[yyyy]-[mm]-[d]" key="{stage_date}" /}. Note usage of [ instead of { as the latter reserved for dust

dust.helpers['date'] =  function(chunk, context, bodies, params) {
  var format = params.format.replace(/\[/g, '{').replace(/\]/g,'}'),
    key;

  if (params && params.key) {
    key = params.key;
    key = this.tap(key, chunk, context);

    if (format === 'relative') {
      return chunk.write(  Date.create(key).relative() )
    } else if (format === 'long') {
      return chunk.write(  Date.create(key).long() )
    } else {
      return chunk.write(  Date.create(key).format(format) )
    }
  }

  return chunk;
};