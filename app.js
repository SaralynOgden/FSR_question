document.addEventListener("DOMContentLoaded", function() {

  function traverseTheDOM(portion, level) {
    if (typeof portion.content === 'string') {
      return `${'\t'.repeat(level)}<${portion.tag}>${portion.content}</${portion.tag}>`;
    } else if (typeof portion.content === 'object') {
      if (Array.isArray(portion.content)) {
        const arrayHTML = portion.content.map((newPortion) => {
          return `${traverseTheDOM(newPortion, level + 1)}\n`;
        }).join('');
        return `${'\t'.repeat(level)}<${portion.tag}>\n\
${arrayHTML}${'\t'.repeat(level)}</${portion.tag}>`;
      } else {
        return `${'\t'.repeat(level)}<${portion.tag}>\n\
${traverseTheDOM(portion.content, level + 1)}\n</${portion.tag}>\n`;
      }
    }
  }

  function removeAllChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function getHTMLFromJSON(event) {
    let htmlJSON = JSON.parse(event.target.result);
    let translatedHTML = '';

    for (const portion of htmlJSON) {
      translatedHTML += traverseTheDOM(portion, 0);
    }
    const userHTMLContainer = document.getElementById('user-html-container');

    removeAllChildren(userHTMLContainer);
    userHTMLContainer.insertAdjacentHTML('afterbegin', translatedHTML);
  }

  if (window.File && window.FileReader && window.FileList && window.Blob) {
    function handleFileSelection(event) {
      const file = event.target.files[0];
      if (file.type !== 'application/json') {
        alert('only JSON files may be converted to HTML');
      } else {
        const reader = new FileReader();

        reader.onload = getHTMLFromJSON;
        reader.readAsText(file);
      }
    }

    document.getElementById('file-input').onchange = handleFileSelection;
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
});
