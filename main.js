document.addEventListener('DOMContentLoaded', function () {
    // 要素ボタンの要素を取得
    var showElementButton = document.getElementById('show-element-button');

    // ドラッグする要素を取得
    var dragElement = document.getElementById('drag-element');

    // 要素ボタンがクリックされたときのイベントリスナー
    showElementButton.addEventListener('click', function () {
        if (dragElement.classList.contains('active')) {
            dragElement.classList.remove('active'); // 'active'クラスを削除してスライドアウト
        } else {
            dragElement.classList.add('active'); // 'active'クラスを追加してスライドイン
        }
    });


    // ドラッグ＆ドロップエリアの要素を取得
    var dropArea = document.getElementById('drop-area');

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

            // ドロップ位置に要素を追加
            clonedElement.style.position = 'absolute';
            clonedElement.style.left = x + 'px';
            clonedElement.style.top = y + 'px';
            dropArea.appendChild(clonedElement);
        }
    });

    dragElement.addEventListener('dragstart', function (ev) {
        drag(ev);
    });

    // ドラッグされた要素を設定する
    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }
    
});
