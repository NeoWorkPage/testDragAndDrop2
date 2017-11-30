// Stylesheet entrypoint
require('_stylesheets/app.styl');

//Список добавленных json
var arrResult = [

];

//Функция загрузки файла через drag and drop
function loadFile() {
  var dnd = new DnDFileController('#load-block', function(files) {
    var f = files[0];
    var reader = new FileReader();

    reader.onloadend = function(e) {
      try {
        var arr = JSON.parse(this.result)
        //Проверка на массив
        if(Array.isArray(arr)){
          var result = {
            'result':  arr,
            'NameFile': files[0].name,
            'SizeFile': files[0].size
          };
        } else{
          var result = {
            'result':  [arr],
            'NameFile': files[0].name,
            'SizeFile': files[0].size
          };
        }

        arrResult.push(result.result);
        renderList(result)
        showDragWrapper()
      } catch (err) {
        errorPopup(err)
      }
    };
    reader.readAsText(f);
  });
}
loadFile();

var i = 0

//Функция рендера данных загруженных файлов
function renderList(items) {
  var wrapperId = document.getElementById('listItems');
  var dragBlock = document.getElementById('listText');
  var newElement = document.createElement('div');
  newElement.innerHTML =
    '<div class="list__item"  id="listItem' + i + '">' +
    '' + items.NameFile +'' +
    '<span class="list__item-count">Кол-во obj:' + items.result.length + '</span> ' +
    '<span class="list__item-size">' + items.SizeFile + ' байт</span>' +
    '</div>';
  wrapperId.appendChild(newElement);
  dragBlock.innerHTML = JSON.stringify(arrResult, null, '\t');

  return i++
}

//Загрузка файла через Submit
function loaderSubmit() {
  document.forms.upload.onsubmit = function() {
    var input = this.elements.file.files[0];
    if (input) {
      upload(input);
    }
    return false;
  }
}
loaderSubmit();


function upload(file) {
  var f = file
  var reader = new FileReader();
  reader.onloadend = function(e) {
    try {
      var arr = JSON.parse(this.result)
      //Проверка на массив
      if(Array.isArray(arr)){
        var result = {
          'result':  arr,
          'NameFile': file.name,
          'SizeFile': file.size
        };
      } else{
        var result = {
          'result':  [arr],
          'NameFile': file.name,
          'SizeFile': file.size
        };
      }
      arrResult.push(result.result);
      renderList(result)
      showDragWrapper()
    } catch (err) {
      errorPopup(err)
    }
  }
  reader.readAsText(f);

}

function clickLoader() {
  document.getElementById("downloadAnchorElem").addEventListener("click", downloadObjectAsJson)
}
clickLoader();


//Скачать json
function downloadObjectAsJson(){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arrResult));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", "result.json");
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}


//Вывод popup с ошибкой
function errorPopup(now){
  var newDiv = document.createElement('div');
  newDiv.classList.add('popup');
  newDiv.innerHTML = '<div class="popup_modal">' +
    'Некорректный файл.</br>' + now + '' +
    '</div>';
  document.body.appendChild(newDiv);
  setTimeout(function () {
    document.body.removeChild(newDiv)
  }, 3000)
}

//Скрывать список файла если нет загруженных файлов
function showDragWrapper() {
  var drag = document.getElementById('list')
  if(arrResult.length === 0) {
    drag.classList.add('dn')
  } else{
    drag.classList.remove('dn')
  }
}
showDragWrapper();
