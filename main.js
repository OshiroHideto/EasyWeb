document.addEventListener('DOMContentLoaded', function () {
    // 保存ボタンの要素を取得
    var saveButton = document.getElementById('save-button');

    // ドラッグ＆ドロップエリアの要素を取得
    var dropArea = document.getElementById('drop-area');

    // ドラッグされた要素を設定する
    var dragElement = document.getElementById('drag-element');

    // ドラッグオーバー時のイベントリスナー
    dropArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropArea.classList.add('hover');
    });

    // ドラッグ終了時のイベントリスナー
    dropArea.addEventListener('dragleave', function (e) {
        e.preventDefault();
        dropArea.classList.remove('hover');
    });

    // ドロップ時のイベントリスナー
    dropArea.addEventListener('drop', function (e) {
        e.preventDefault();
        dropArea.classList.remove('hover');

        // ドロップ位置の座標を取得
        var x = e.clientX - dropArea.getBoundingClientRect().left;
        var y = e.clientY - dropArea.getBoundingClientRect().top;

        var droppedElementId = e.dataTransfer.getData("text");
        var droppedElement = document.getElementById(droppedElementId);

        // ドロップされた要素が存在する場合のみ処理を続行
        if (droppedElement) {
            // ドロップされた要素のコピーを作成
            var clonedElement = droppedElement.cloneNode(true);

            // 一意の識別子を生成してクローンされた要素に追加
            var uniqueId = Date.now(); // 現在のタイムスタンプを使用して一意のIDを生成
            clonedElement.id = "clonedElement_" + uniqueId; // 識別子を設定

            // ドロップ位置に要素を追加
            clonedElement.style.position = 'absolute';
            clonedElement.style.left = x + 'px';
            clonedElement.style.top = y + 'px';
            clonedElement.style.resize = 'both';
            clonedElement.classList.add('cloned-element');

            // クリック時のイベントリスナーを追加
            clonedElement.addEventListener('click', function () {
                // クリックされた要素が選択された状態になるようにする
                var clonedElements = document.querySelectorAll('.cloned-element');
                clonedElements.forEach(function (element) {
                    element.classList.remove('selected');
                });
                clonedElement.classList.add('selected');
                // 選択された要素のスタイルを表示する
                displaySelectedElementStyle(clonedElement);
            });

            // ドラッグ＆ドロップされた要素を設定する
            addDraggableListeners(clonedElement);

            // リサイズイベントリスナーを追加
            addResizableListeners(clonedElement);

            dropArea.appendChild(clonedElement);
        }
    });

    // ドラッグ＆ドロップされた要素を設定する
    var clonedElements = document.querySelectorAll('.cloned-element');
    clonedElements.forEach(addDraggableListeners);

    // 要素を移動するための関数
    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    // ドラッグ＆ドロップイベントリスナーを追加する関数
    function addDraggableListeners(element) {
        var active = false; // ドラッグ中かどうかを示すフラグ
        var initialX, initialY; // ドラッグ開始時のマウス座標
        var xOffset = 0, yOffset = 0; // ドラッグ中の要素のオフセット
        var draggedElement = null; // ドラッグされている要素

        // ドラッグ開始時の処理
        element.addEventListener('mousedown', function (e) {
            active = true;
            draggedElement = element;

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            // ドラッグされた要素を最前面に表示
            draggedElement.style.zIndex = '100';
        });

        // ドラッグ終了時の処理
        element.addEventListener('mouseup', function () {
            active = false;
            draggedElement.style.zIndex = ''; // ドラッグ終了後、z-index をクリア
        });

        // ドラッグ中の処理
        element.addEventListener('mousemove', function (e) {
            if (active) {
                e.preventDefault();

                var xPos = e.clientX - initialX;
                var yPos = e.clientY - initialY;

                currentX = xPos;
                currentY = yPos;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, draggedElement);
            }
        });
    }

    // リサイズハンドルの要素
    var resizeHandleSize = 10; // リサイズハンドルのサイズ
    var resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';

    function addResizableListeners(element) {
        // リサイズハンドルがドラッグされたかどうかを示すフラグ
        var isResizing = false;
        element.appendChild(resizeHandle);
        
        // ドラッグされた要素をリサイズするための関数
        function resizeElement(deltaX, deltaY) {
            var width = parseInt(document.defaultView.getComputedStyle(element).width, 10) + deltaX;
            var height = parseInt(document.defaultView.getComputedStyle(element).height, 10) + deltaY;
            element.style.width = width + 'px';
            element.style.height = height + 'px';
        }

        // リサイズ開始時の処理
        element.addEventListener('mousedown', function (e) {
            var right = element.offsetLeft + element.offsetWidth;
            var bottom = element.offsetTop + element.offsetHeight;
            if (
                e.clientX >= right - resizeHandleSize &&
                e.clientX <= right &&
                e.clientY >= bottom - resizeHandleSize &&
                e.clientY <= bottom
            ) {
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
                startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
            }
        });

        // リサイズ中の処理
        window.addEventListener('mousemove', function (e) {
            if (isResizing) {
                var deltaX = e.clientX - startX;
                var deltaY = e.clientY - startY;
                resizeElement(deltaX, deltaY);
            }
        });

        // リサイズ終了時の処理
        window.addEventListener('mouseup', function () {
            isResizing = false;
        });
    }

    // 保存ボタンがクリックされたときのイベントリスナー
    saveButton.addEventListener('click', function () {
        // 要素の情報からHTMLコードを生成する
        var generatedHTML = `
        <!DOCTYPE html>
        <html lang="jp">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Generated HTML</title>
            <style>
                /* ここに要素のスタイル情報を追加 */
            </style>
        </head>
        <body>
            ${dropArea.innerHTML}
        </body>
        </html>
    `;

        // ダウンロード用の処理
        var blob = new Blob([generatedHTML], { type: "text/html" });
        var url = URL.createObjectURL(blob);
        var downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "generated_file.html";
        downloadLink.textContent = "Download Generated HTML";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        URL.revokeObjectURL(url);
    });

    // ドラッグされた要素を設定する
    dragElement.addEventListener('dragstart', function (ev) {
        drag(ev);
    });

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    // スタイルタブの背景色や文字色を変更する処理
    var styleControls = document.querySelectorAll('.style-controls');

    styleControls.forEach(function (controls) {
        controls.addEventListener('change', function (e) {
            var selectedElement = document.querySelector('.selected');
            if (selectedElement) {
                var backgroundColorPicker = controls.querySelector('#background-color');
                var textColorPicker = controls.querySelector('#text-color');
                var widthInput = controls.querySelector('#width-input');
                var heightInput = controls.querySelector('#height-input');
                var textInput = controls.querySelector('#text-input');
                var fontsizeInput = controls.querySelector('#font-size-input');
                var fontfamily = controls.querySelector('#font-family-input');
                var textAlignSelect = controls.querySelector('#text-align-select');

                selectedElement.style.backgroundColor = backgroundColorPicker.value;
                selectedElement.style.color = textColorPicker.value;
                selectedElement.style.width = widthInput.value + 'px';
                selectedElement.style.height = heightInput.value + 'px';
                selectedElement.innerText = textInput.value;
                selectedElement.style.fontSize = fontsizeInput.value + 'px';
                selectedElement.style.fontFamily = fontfamily.value;
                selectedElement.style.textAlign = textAlignSelect.value;
            }
        });
    });

    // RGB形式の色をHEX形式に変換する関数
    function rgbToHex(rgb) {
        // RGB形式の文字列を分割して、各色の値を取得
        var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!parts) {
            return rgb; // 変換できない場合はそのまま返す
        }
        // 各色の値を16進数に変換して、2桁の値にする
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        // 16進数形式の色コードを返す
        return "#" + hex(parts[1]) + hex(parts[2]) + hex(parts[3]);
    }

    function displaySelectedElementStyle(element) {
        var backgroundColorPicker = document.querySelector('#background-color');
        var textColorPicker = document.querySelector('#text-color');
        var widthInput = document.querySelector('#width-input');
        var heightInput = document.querySelector('#height-input');
        var textInput = document.querySelector('#text-input');
        var fontsizeInput = document.querySelector('#font-size-input');
        var fontfamily = document.querySelector('#font-family-input');
        var textAlignSelect = document.querySelector('#text-align-select');

        // 選択された要素のスタイルを取得
        var computedStyle = getComputedStyle(element);

        // RGB形式の色をHEX形式に変換してUIにセット
        backgroundColorPicker.value = rgbToHex(computedStyle.backgroundColor) || '';
        textColorPicker.value = rgbToHex(computedStyle.color) || '';
        widthInput.value = parseInt(computedStyle.width) || '';
        heightInput.value = parseInt(computedStyle.height) || '';
        textInput.value = element.innerText || '';
        fontsizeInput.value = parseInt(computedStyle.fontSize) || '';
        fontfamily.value = computedStyle.fontFamily || '';
        textAlignSelect.value = computedStyle.textAlign || 'left'; // textAlignをセット
    }

    // 初期状態で選択中の要素があれば、そのスタイルを表示する
    var selectedElement = document.querySelector('.selected');
    if (selectedElement) {
        displaySelectedElementStyle(selectedElement);
    }

});
