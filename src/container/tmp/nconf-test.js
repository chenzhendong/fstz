var nconf = require('nconf');

  
  
  var file1 =   __dirname + '/file1.json';
  var file2 =   __dirname + '/file2.json';
  var file3 =   __dirname + '/file3.json';
  //var runtimeFile =   __dirname + '/runtime.json';
  //nconf.add('env', {type: 'env'});
  
  nconf.argv();
  nconf.env();
  nconf.add('file1',{type: 'file', file: file1});
  nconf.add('file2',{type: 'file', file: file2});
  nconf.add('file3',{type: 'file', file: file3});
  //nconf.add('global',{type: 'file', file: runtimeFile});
  
  nconf.stores.file1.store.value4 = 'runtime';
  
  
  var file3Obj = nconf.loadFilesSync([file3]);
  console.log(file3Obj);
  
  nconf.set('value5', 'in-line');
  //nconf.use('default',{type: 'file', file: mergeFile});
  
  //nconf.save('merge', {type: 'file', file: mergeFile});

  //
  // Get the entire database object from nconf. This will output
  // { host: '127.0.0.1', port: 5984 }
  //
  console.log('value1: ' + nconf.get('value1'));
  console.log('value2: ' + nconf.get('value2'));
  console.log('value3: ' + nconf.get('value3'));
  console.log('value4: ' + nconf.get('value4'));
  console.log('value5: ' + nconf.get('value5'));
  console.log('argv: ' + nconf.get('foo'));
  
  
  console.log(nconf.stores);
  //console.log(nconf.stores);
  
  
  
  
  