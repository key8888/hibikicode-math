# 第3章 最初のグラフ
## 3.2 点をプロットするには

### 説明＆コード
点を置くことを「プロットする」と言うよ。Bokehでは `plot_points` 関数を使えば、座標のリストからまとめて描ける。

```python
x_list = [0, 1, 2, 3]
y_list = [0, 1, 4, 9]

plot = new_plot(title="二乗の成長を点で見る")
plot_points(x_list, y_list, target_plot=plot, size=10, marker="circle", color="#ff7f0e", legend_label="y = x^2 の点")
```

`plot_points` の引数を整理すると、

- `x_values`, `y_values`: 点の座標。リストやタプルで渡す。
- `target_plot`: どのグラフに描くか。省略すると新しい図を作って返してくれるけど、今回は変数 `plot` を作ってから渡している。
- `size`: 点の大きさ。後で詳しくやるよ。
- `marker`: 点の形。"circle" のほかに "square"、"triangle" などもある。

Pythonでは、リストの順番がそのまま点を描く順番になる。先に `x_list` と `y_list` を用意することで、データの準備 → 描画という流れがスムーズになるんだ。

`ColumnDataSource`（コラムデータソース）は、Bokehが内部でデータを管理するための入れ物。今回はリストを直接渡したけど、たくさんの列（データ項目）を持っているときは便利。

```python
from bokeh.plotting import ColumnDataSource

data = ColumnDataSource(data={
    "x": [0, 1, 2, 3],
    "y": [0, 1, 4, 9],
    "label": ["原点", "1の2乗", "2の2乗", "3の2乗"],
})

plot = new_plot(title="ColumnDataSourceで点を描く")
plot_points(data.data["x"], data.data["y"], target_plot=plot, legend_label="データソースの点")
```

`data.data["x"]` のように列を取り出して `plot_points` に渡せる。ColumnDataSourceを使うと、後でホバー機能などと連携しやすくなるんだ。

#### ミニ課題
`x` が $0$ から $5$ まで増えるとき、`y = 2x + 1` の点をプロットしてみよう。`x_list` と `y_list` を自分で計算して作るのがポイント！

### 質問タイム
1. `plot_points` に渡す `x_values` と `y_values` の長さ（要素数）はどうなっている必要がある？
2. ColumnDataSourceを使うとどんな良さがあった？一文でまとめてみて。

### 振り返り
- [ ] プロットしたいデータをリストでまとめる流れがわかった？
- [ ] ColumnDataSourceにまだ不安がある？あればどこか書き出しておこう。

### 発展
学校で集めたデータ（テスト結果や観察記録など）を、ColumnDataSourceを使って整理し、点グラフで表現してみよう。データを整える力も同時に身につくよ。
