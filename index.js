
function transformUbigeos(evt){//Lee archivo
    const fileReader= new FileReader();
    const file=evt.target.files[0];
    if(file.type.includes('plain')){
        cleanTables();
        fileReader.onload=()=>{
            const {result}=fileReader;
            const formatedUbigeos=formatUbigeos(result.split(/\n/));
            showUbigeos(formatedUbigeos);
        }
        fileReader.readAsText(file);
    }else{
        alert('El archivo debe ser de texto plano');
    }
}

function formatUbigeos(ubigeos){//Formatea y guarda cada parte de los ubigeos en su propia estructura (Departamentos, Provincias, Distritos)
    const districts=[];
    const provinces=[];
    const states=[];
    for(ubigeo of ubigeos){
        const ubigeoParts=ubigeo.replace(/"/g,'').split('/');
        for(let i=ubigeoParts.length-1;i>=0;i--){
            if(ubigeoParts[i].replace(/\s/g, '').length){
                const newUbigeoPart={
                    'code':ubigeoParts[i].split(/\s([A-Z]|[a-z])/)[0].trim(),
                    'name':ubigeoParts[i].split(/[0-9]\s/)[1].trim(),
                    "parentCode":i===0?'-':ubigeoParts[i-1].split(/\s([A-Z]|[a-z])/)[0].trim(),
                    'parentName':i===0?'-':ubigeoParts[i-1].split(/[0-9]\s/)[1].trim()
                }
                if(i===2 && 
                    !districts.some(item=>item.code===newUbigeoPart.code)){
                    districts.push(newUbigeoPart);
                }else if(i===1 && 
                    !provinces.some(item=>item.code===newUbigeoPart.code)){
                    provinces.push(newUbigeoPart);
                }else if(i===0 && 
                    !states.some(item=>item.code===newUbigeoPart.code)){
                    states.push(newUbigeoPart);
                }
                i=0;
            }
        }
    }
    return {
        states,
        provinces,
        districts
    }
}

function showUbigeos(arrays){
    const states= document.getElementById('states');
    const provinces=document.getElementById('provinces');
    const districts=document.getElementById('districts');
    populateTable(arrays.states,states);
    populateTable(arrays.provinces,provinces);
    populateTable(arrays.districts,districts);
    console.log(arrays.states);
    console.log(arrays.provinces);
    console.log(arrays.districts);
    
}

function populateTable(array,baseEl){
    for(let object of array){
        const newEl=document.createElement('TR');
        newEl.innerHTML=`<tr><td>${object.code}</td>`+
        `<td>${object.name}</td>`+
        `<td>${object.parentCode}</td>`+
        `<td>${object.parentName}</td></tr>`;
        baseEl.appendChild(newEl);
    }
}

function cleanTables(){
    document.getElementById('states').innerHTML='';
    document.getElementById('provinces').innerHTML='';
    document.getElementById('districts').innerHTML='';
}

document.getElementById('input')
.addEventListener('change',
 transformUbigeos,
  false);