var convert = require('xml-js');
const fs = require("fs");

function extractX(file)
{
    const xml = fs.readFileSync(file);
    console.log(file)
    
    //console.log(xml);
    var result1 = convert.xml2json(xml, {compact: true, spaces: 4});
    var result2 = convert.xml2json(xml, {compact: false, spaces: 4});
    //console.log(result1, '\n', result2);
    
    //fs.writeFileSync(file+".json", result1);
    
    jsonxml = (JSON.parse(result1))
    
    if ( typeof jsonxml['nfeProc'] !== 'undefined' && jsonxml['nfeProc'])
    {
        console.log("UNDEFINED")
        myobject = jsonxml['nfeProc']["NFe"]["infNFe"]["det"]
    }
    else
    {
        console.log("OK")
        myobject = jsonxml["NFe"]["infNFe"]["det"]
    }
    //Need the following columns 
    //(Codigo de Barras ; Descricao ;Quantidade;
    //FALTA (empty column);SOBRA (empty column);CONFERENCIA (empty column);codigo errado (empty column)
    var row = 'Codigo Barras\tDescricao\tQuantidade\tFALTA\tSOBRA\tCONFERENCIA\tCodigo Errado\n'
    for(var i = 0; i < myobject.length; i++)
    {
        cod = (myobject[i]["prod"]["cProd"]["_text"]);
        qtde = (myobject[i]["prod"]["qCom"]["_text"]);
        desc = (myobject[i]["prod"]["xProd"]["_text"]);
        codbar = (myobject[i]["prod"]["cEAN"]["_text"]);
        empty = 0
        row = row + codbar + '\t' + desc + '\t' + qtde.replace(".",",") + '\t' + empty + '\t' + empty + '\t' + empty + '\t' + empty + '\n' 
    }
    
    fs.writeFile('output/'+file+'.csv', row, (err) => {
        if (err) throw err;
        console.log('File created from: '+file);
    });   
}

fs.readdir('./', (err, files) => {
    files.forEach(file => {
      if(file.split('.').pop() == 'xml')
      extractX(file)
    });
  });