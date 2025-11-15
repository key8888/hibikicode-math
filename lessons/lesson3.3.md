# 第3章 最初のグラフ
## 3.3 点の大きさを変えるには

### 説明＆コード
点の大きさは情報を強調するのに大事なパラメータ。`plot_points` の `size` 引数で設定できる。サイズは画面上のピクセル数と思ってOK。

```python
x = [1, 2, 3, 4]
y = [2, 2, 2, 2]

plot = new_plot(title="サイズの比較")
plot_points(x, y, target_plot=plot, size=6, marker="circle", color="#1f77b4", legend_label="size=6")
plot_points(x, [v + 0.5 for v in y], target_plot=plot, size=12, marker="circle", color="#ff7f0e", legend_label="size=12")
plot_points(x, [v + 1.0 for v in y], target_plot=plot, size=20, marker="circle", color="#2ca02c", legend_label="size=20")
```

リスト内包表記 `[v + 0.5 for v in y]` は、すべての要素に同じ値を足して高さをずらしているだけ。Pythonに慣れる練習にもなるね。

マーカーの種類も `marker` で変えられる。

```python
markers = ["circle", "square", "triangle", "diamond"]
plot = new_plot(title="マーカーの形を比べる")

for i, marker in enumerate(markers):
    plot_points([i + 1], [i + 1], target_plot=plot, size=14, marker=marker, color="#9467bd", legend_label=f"marker={marker}")
```

`enumerate` は「番号と中身をセットで取り出す」便利関数。`i` が番号、`marker` がマーカー名になる。`f"..."` は文字列の中で変数を埋め込む書き方。

#### ミニ課題
`x = [0, 1, 2, 3]` を使って、自分の好きな4つのサイズを試そう。どのサイズが一番見やすかったか理由もセットで考えてみて！

### 質問タイム
1. サイズを大きくすると読み取りやすい場合はどんなとき？
2. マーカーを変えるとき、色も一緒に変えた方がいい場面はある？

### 振り返り
- [ ] `size` と `marker` の意味を説明できる？
- [ ] まだ操作に自信がない部分はどこ？

### 発展
理科の実験データなどで、重要な測定結果を大きい点、通常の結果を小さい点にしてみよう。視覚的にどこが注目ポイントか伝えられるようになるよ。
