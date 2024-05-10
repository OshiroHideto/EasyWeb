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
            // 新しい<div>要素を作成
            var newDiv = document.createElement('div');
            newDiv.classList.add('cloned-element');

            // 一意の識別子を生成して新しい<div>要素に追加
            var uniqueId = Date.now(); // 現在のタイムスタンプを使用して一意のIDを生成
            newDiv.id = "clonedElement_" + uniqueId; // 識別子を設定

            // ドロップ位置に要素を追加
            newDiv.style.position = 'absolute';
            newDiv.style.left = x + 'px';
            newDiv.style.top = y + 'px';

            // クリック時のイベントリスナーを追加
            newDiv.addEventListener('click', function () {
                // クリックされた要素が選択された状態になるようにする
                var clonedElements = document.querySelectorAll('.cloned-element');
                clonedElements.forEach(function (element) {
                    element.classList.remove('selected');
                });
                newDiv.classList.add('selected');

                // 選択された要素のスタイルを表示する
                displaySelectedElementStyle(newDiv);

                // 選択された要素のタイプに応じてUIを制御
                checkSelectedElementType(newDiv);
            });

            // 元の要素と同じ高さと幅を設定
            newDiv.style.width = droppedElement.offsetWidth + 'px';
            newDiv.style.height = droppedElement.offsetHeight + 'px';

            // ドロップされた要素を新しい<div>要素に追加
            var clonedElement = droppedElement.cloneNode(true);
            newDiv.appendChild(clonedElement);

            // ドラッグ＆ドロップされた要素を設定する
            addDraggableListeners(newDiv);

            dropArea.appendChild(newDiv);

            // リサイズハンドルの要素を作成
            var resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';

            // resizeHandle のサイズを設定
            resizeHandle.style.width = '15px';
            resizeHandle.style.height = '15px';

            // resizeHandle を newDiv の右下に配置
            resizeHandle.style.position = 'absolute';
            resizeHandle.style.bottom = '0';
            resizeHandle.style.right = '0';

            // newDiv に resizeHandle を追加
            newDiv.appendChild(resizeHandle);

            // リサイズ開始時の座標とサイズを保持する変数
            var startX, startY, startWidth, startHeight;

            // リサイズハンドルにマウスが乗ったときの処理
            resizeHandle.addEventListener('mouseenter', function () {
                resizeHandle.style.cursor = 'se-resize';
            });

            // リサイズハンドルからマウスが離れたときの処理
            resizeHandle.addEventListener('mouseleave', function () {
                resizeHandle.style.cursor = 'default';
            });

            // リサイズハンドルがクリックされたときの処理
            resizeHandle.addEventListener('mousedown', function (e) {
                e.preventDefault();
                document.body.style.cursor = 'se-resize';
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(document.defaultView.getComputedStyle(newDiv).width, 10);
                startHeight = parseInt(document.defaultView.getComputedStyle(newDiv).height, 10);

                // マウスのクリック位置からリサイズ判定エリアの右下の10px以内かどうかをチェック
                var offsetX = startX - newDiv.getBoundingClientRect().right;
                var offsetY = startY - newDiv.getBoundingClientRect().bottom;
                var resizeAreaWidth = 10; // 横のリサイズ判定エリアの幅
                var resizeAreaHeight = 10; // 縦のリサイズ判定エリアの高さ

                if (offsetX <= resizeAreaWidth && offsetY <= resizeAreaHeight) {
                    // リサイズ中のイベントリスナーを追加
                    window.addEventListener('mousemove', resizeElement);
                    // リサイズ終了時のイベントリスナーを追加
                    window.addEventListener('mouseup', stopResizeElement);
                }
            });

            // リサイズ中の処理
            function resizeElement(e) {
                var deltaX = e.clientX - startX;
                var deltaY = e.clientY - startY;
                newDiv.style.width = (startWidth + deltaX) + 'px';
                newDiv.style.height = (startHeight + deltaY) + 'px';

                // childrenプロパティを使用して子要素を取得
                var childrenArray = newDiv.children;
                for (var i = 0; i < childrenArray.length; i++) {
                    var childElement = childrenArray[i];
                    if (childElement.classList.contains('resize-handle')) {
                        // resize-handleのサイズは変更しない
                    } else {
                        childElement.style.width = '100%';
                        childElement.style.height = '100%';
                    }
                }
            }

            // リサイズ終了時の処理
            function stopResizeElement() {
                // リサイズ中のイベントリスナーを削除
                window.removeEventListener('mousemove', resizeElement);
                // リサイズ終了時のイベントリスナーを削除
                window.removeEventListener('mouseup', stopResizeElement);

                document.body.style.cursor = 'default';
            }
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
            // マウスイベントがリサイズハンドル上で発生したかどうかをチェック
            var isResizeHandleClicked = e.target.classList.contains('resize-handle');

            if (!isResizeHandleClicked) {
                // ドラッグ開始処理
                active = true;
                draggedElement = element;

                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;

                // ドラッグされた要素を最前面に表示
                draggedElement.style.zIndex = '100';
            }
        });

        // ドラッグ終了時の処理
        element.addEventListener('mouseup', function () {
            if (draggedElement) {
                active = false;
                draggedElement.style.zIndex = ''; // ドラッグ終了後、z-index をクリア
            }
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


    // 保存ボタンがクリックされたときのイベントリスナー
    saveButton.addEventListener('click', function () {
        // ドロップエリア内のすべての要素のスタイルを取得
        var clonedElements = document.querySelectorAll('.cloned-element');
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
        <div id="drop-area" style="${dropArea.getAttribute('style')}">
            ${dropArea.innerHTML}
        </div>
    </body>
    </html>
`;

        // 保存処理
        // 保存処理
        var blob = new Blob([generatedHTML], { type: "text/html" });
        var url = URL.createObjectURL(blob);
        var downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "generated_file.html";
        downloadLink.textContent = "作成したHTML";

        // "Drag & Drop Files Here"の文字列を保存対象外にする
        var dragDropText = dropArea.querySelector('.drag-drop-text');
        if (dragDropText) {
            dropArea.removeChild(dragDropText);
        }

        dragElement.appendChild(downloadLink);
        downloadLink.click();
        URL.revokeObjectURL(url);

    });


    // ドラッグ＆ドロップされた要素を設定する
    dragElement.addEventListener('dragstart', function (ev) {
        drag(ev);
    });

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }


    // スタイルタブの背景色や文字色を変更する処理
    var styleControls = document.querySelectorAll('.style-controls');

    // スタイルタブの背景色や文字色を変更する処理
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

                // 選択中の要素が特定の条件を満たしている場合のみスタイルを取得する
                if (checkElementType(selectedElement)) {
                    selectedElement.querySelector('[class^="drag-element-"]').style.backgroundColor = backgroundColorPicker.value;
                    selectedElement.querySelector('[class^="drag-element-"]').style.color = textColorPicker.value;
                    selectedElement.querySelector('[class^="drag-element-"]').innerText = textInput.value;
                    selectedElement.querySelector('[class^="drag-element-"]').style.fontSize = fontsizeInput.value + 'px';
                    selectedElement.querySelector('[class^="drag-element-"]').style.fontFamily = fontfamily.value;
                    selectedElement.querySelector('[class^="drag-element-"]').style.textAlign = textAlignSelect.value;
                    selectedElement.querySelector('[class^="drag-element-"]').style.width = widthInput.value + 'px';
                    selectedElement.querySelector('[class^="drag-element-"]').style.height = heightInput.value + 'px';
                    // 要素と同じ高さと幅を設定
                    selectedElement.style.width = selectedElement.querySelector('[class^="drag-element-"]').style.width;
                    selectedElement.style.height = selectedElement.querySelector('[class^="drag-element-"]').style.height;

                    selectedElement.style.marginBottom = '0px';
                } else {
                    selectedElement.querySelector('[class^="drag-element-"]').style.width = widthInput.value + 'px';
                    selectedElement.querySelector('[class^="drag-element-"]').style.height = heightInput.value + 'px';
                    // 要素と同じ高さと幅を設定(margin込み)
                    selectedElement.style.width = (parseInt(widthInput.value) + 2) + 'px';;
                    selectedElement.style.height = (parseInt(heightInput.value) + 5) + 'px';
                }
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

    // 選択された要素のスタイルを取得して表示する関数
    function displaySelectedElementStyle(selectedElement) {
        var backgroundColorPicker = document.querySelector('#background-color');
        var textColorPicker = document.querySelector('#text-color');
        var widthInput = document.querySelector('#width-input');
        var heightInput = document.querySelector('#height-input');
        var textInput = document.querySelector('#text-input');
        var fontsizeInput = document.querySelector('#font-size-input');
        var fontfamily = document.querySelector('#font-family-input');
        var textAlignSelect = document.querySelector('#text-align-select');


        var imageUploadUI = document.querySelector('.image-upload-ui');
        var audioUploadUI = document.querySelector('.audio-upload-ui');
        var videoUploadUI = document.querySelector('.video-upload-ui');
        var styleControls = document.querySelector('.style-controls');


        var computedStyle = getComputedStyle(selectedElement.querySelector('[class^="drag-element-"]'));

        widthInput.value = parseInt(computedStyle.width) || '';
        heightInput.value = parseInt(computedStyle.height) || '';
        textInput.value = selectedElement.innerText || '';
        fontsizeInput.value = parseInt(computedStyle.fontSize) || '';
        fontfamily.value = computedStyle.fontFamily || '';
        textAlignSelect.value = computedStyle.textAlign || 'left';

        // 選択中の要素が特定の条件を満たしている場合のみスタイルを取得する
        if (checkElementType(selectedElement)) {

            textColorPicker.value = rgbToHex(computedStyle.color) || '';
            backgroundColorPicker.value = rgbToHex(computedStyle.backgroundColor) || '';
        } else {
            // すべてのスタイルコントロールを無効にする
            styleControls.querySelectorAll('input, select').forEach(function (el) {
                el.disabled = true;
            });

            // 高さ、幅、およびアップロードUIのみを有効にする
            heightInput.disabled = false;
            widthInput.disabled = false;
            imageUploadUI.querySelector('input[type="file"]').disabled = false;
            audioUploadUI.querySelector('input[type="file"]').disabled = false;
            videoUploadUI.querySelector('input[type="file"]').disabled = false;
        }
    }

    function checkElementType(selectedElement) {
        // 選択された要素が指定のクラスを持っているかどうかをチェックする再帰関数
        function hasClassRecursive(element, className) {
            if (element.classList.contains(className)) {
                return true; // クラスが見つかったら true を返す
            }
            // 子孫要素を再帰的に調べる
            for (var i = 0; i < element.children.length; i++) {
                if (hasClassRecursive(element.children[i], className)) {
                    return true; // 子孫要素の中にクラスが見つかったら true を返す
                }
            }
            return false; // 見つからなかった場合は false を返す
        }

        // 選択された要素が指定のクラスを持っているかどうかをチェック
        if (hasClassRecursive(selectedElement, 'drag-element-img') ||
            hasClassRecursive(selectedElement, 'drag-element-audio') ||
            hasClassRecursive(selectedElement, 'drag-element-video')) {
            return false; // いずれかのクラスが見つかった場合は false を返す
        } else {
            return true; // どのクラスも見つからなかった場合は true を返す
        }
    }

    // 初期状態で選択中の要素があれば、そのスタイルを表示する
    var selectedElement = document.querySelector('.selected');
    if (selectedElement) {
        displaySelectedElementStyle(selectedElement);
    }

    // 削除ボタンの要素を取得
    var deleteButton = document.getElementById('delete-button');

    // 削除ボタンがクリックされたときのイベントリスナーを追加
    deleteButton.addEventListener('click', function () {
        // 選択中の clonedElement を取得
        var selectedElement = document.querySelector('.selected');

        // clonedElement が存在する場合は削除する
        if (selectedElement) {
            selectedElement.remove();
        }
    });


    // 前面に表示ボタンがクリックされたときの処理
    document.getElementById('bring-to-front').addEventListener('click', function () {
        var selectedElement = document.querySelector('.selected');
        if (selectedElement) {
            dropArea.appendChild(selectedElement); // ドロップエリアの最後尾に移動
        }
    });

    // 後面に表示ボタンがクリックされたときの処理
    document.getElementById('send-to-back').addEventListener('click', function () {
        var selectedElement = document.querySelector('.selected');
        if (selectedElement) {
            dropArea.insertBefore(selectedElement, dropArea.firstChild); // ドロップエリアの最前面に移動
        }
    });

    var styleControls = document.querySelector('.style-controls');
    // 選択された要素のタイプをチェックしてUIを制御する関数
    function checkSelectedElementType(selectedElement) {
        var imageUploadUI = styleControls.querySelector('.image-upload-ui');
        var audioUploadUI = styleControls.querySelector('.audio-upload-ui');
        var videoUploadUI = styleControls.querySelector('.video-upload-ui');

        // 初期状態ではすべてのUIを非表示にする
        imageUploadUI.style.display = 'none';
        audioUploadUI.style.display = 'none';
        videoUploadUI.style.display = 'none';

        var selectedElement = document.querySelector('.selected');

        if (selectedElement) {
            // 選択中の要素の子要素を取得
            var children = selectedElement.querySelectorAll('*');
            children.forEach(function (child) {
                var classNames = child.classList; // 子要素のクラス名を取得

                var classNamesArray = Array.from(classNames);
                classNamesArray.forEach(function (className) {
                    // 選択された要素のIDに基づいてUIを表示
                    switch (className) {
                        case 'element-img':
                            imageUploadUI.style.display = 'block';
                            break;
                        case 'element-audio':
                            audioUploadUI.style.display = 'block';
                            break;
                        case 'element-video':
                            videoUploadUI.style.display = 'block';
                            break;
                        default:
                            break;
                    }
                });
            });
        }
    }

    document.getElementById('image-upload-input').addEventListener('change', function (e) {
        var file = e.target.files[0]; // 選択されたファイルを取得
        var selectedElement = document.querySelector('.selected'); // 選択中の要素を取得

        if (file && selectedElement) { // ファイルと要素が存在する場合のみ処理を続行
            var reader = new FileReader(); // FileReaderオブジェクトを作成

            // 読み込み完了時の処理
            reader.onload = function (event) {
                var imageDataUrl = event.target.result; // 読み込んだ画像のデータURLを取得

                // 選択中の要素が画像を表示する要素であるかをチェック
                var imgElement = selectedElement.querySelector('.element-img');
                if (imgElement) {
                    imgElement.src = imageDataUrl; // 画像を選択中の要素に適用
                }
            };

            // 読み込みを開始
            reader.readAsDataURL(file); // 画像ファイルをDataURLとして読み込む
        }
    });

});