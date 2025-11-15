# 第2章 Pythonを復習しよう！
## 2.6 多次元配列と表データ

### 説明＆コード
リストの中にリストを入れると、表みたいなデータを扱える。数学で言うと行列のイメージで、$\begin{pmatrix}1 & 2\\3 & 4\end{pmatrix}$ をリストで書くと `[[1, 2], [3, 4]]` になるよ。

```python
matrix = [
    [1, 2],
    [3, 4]
]
print(matrix[0][1])  # 1行目2列目の値 -> 2
```

1つ目の `[]` が行（row）、2つ目の `[]` が列（column）を表している。表データとして扱うときは、外側のリストが行を並べているイメージだね。

座標データも同じ考え方で管理できる。例えば点の集まり $P_1(0, 1), P_2(1, 2), P_3(2, 5)$ をリストにするとこう。

```python
points = [
    [0, 1],
    [1, 2],
    [2, 5]
]
```

Bokeh で表示するときは、`x` と `y` のリストに分けて渡す必要があるから、取り出し方を練習しておこう。

```python
x_values = [point[0] for point in points]
y_values = [point[1] for point in points]
plot = new_plot(title="表データから点を作る")
plot_points(x_values, y_values, target_plot=plot, legend_label="観測データ")
```

`ColumnDataSource` を使うと、表形式のデータをまとめて扱える。辞書（`dict`）で列名をつけて渡すのがポイントだよ。

```python
from bokeh.plotting import ColumnDataSource

data = ColumnDataSource({
    "x": [0, 1, 2],
    "y": [1, 2, 5],
    "label": ["A", "B", "C"]
})
plot = new_plot(title="ラベル付きの点")
plot_points(data.data["x"], data.data["y"], target_plot=plot, legend_label="点群")
```

#### ミニ課題
`table = [["月", 3], ["火", 4], ["水", 2]]` のような曜日と勉強時間の表を作ろう。曜日だけのリストと時間だけのリストを取り出して `print()` し、Bokeh で横軸を数字（0,1,2）に置き換えて点を描いてみて。

### 質問タイム
1. 行列のイメージでリストのリストを見ると何がわかりやすい？
2. `ColumnDataSource` を使うとどんな場面で便利？
3. 座標データを取り出す内包表記の読み方を説明できる？

### 振り返り
- [ ] リストのリストが表データになるイメージをつかんだ
- [ ] Bokeh で表データからグラフを作る流れを試した
- [ ] 疑問点や発見を書き残した

### 発展
- 学校の時間割をリストのリストで表現して、科目ごとにまとめる方法を考えてみよう。
- 座標データを `ColumnDataSource` で管理し、あとからラベルを表示するアイデアを検討してみよう。
