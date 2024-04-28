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

            clonedElement.classList.add('cloned-element');

            // クリック時のイベントリスナーを追加
            clonedElement.addEventListener('click', function () {
                // クリックされた要素が選択された状態になるようにする
                var clonedElements = document.querySelectorAll('.cloned-element');
                clonedElements.forEach(function (element) {
                    element.classList.remove('selected');
                });
                clonedElement.classList.add('selected');
            });

            dropArea.appendChild(clonedElement);

        }
    });

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
                selectedElement.style.backgroundColor = backgroundColorPicker.value;
                selectedElement.style.color = textColorPicker.value;
            }
        });
    });
});
