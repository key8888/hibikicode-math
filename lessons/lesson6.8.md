# 第6章 二次関数
## 6.8 横移動と縦移動の違いを文章で整理する

### 説明＆コード
式とグラフの動きの対応を表で整理しよう。二次関数でも同じ形で使えるから、ここで覚えてしまおう。

| 式の形 | グラフの動き |
| --- | --- |
| \( y = f(x) + k \) | 上に \(k\) だけ移動（\(k<0\) なら下） |
| \( y = f(x - h) \) | 右に \(h\) だけ移動（\(h<0\) なら左） |
| \( y = -f(x) \) | x軸について上下反転 |
| \( y = f(-x) \) | y軸について左右反転 |

コードでこれらをまとめて確かめる例を書いておくよ。

```python
plot = new_plot(title="移動と反転の対応", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 基本の線
plot_function(lambda x: 0.5 * x + 1, x_start=-6, x_end=6, target_plot=plot,
              line_color="#1f77b4", legend_label="y = 0.5x + 1")

# 上に2移動
plot_function(lambda x: 0.5 * x + 3, x_start=-6, x_end=6, target_plot=plot,
              line_color="#ff7f0e", legend_label="+2 上移動")

# 右に2移動
plot_function(lambda x: 0.5 * (x - 2) + 1, x_start=-6, x_end=6, target_plot=plot,
              line_color="#2ca02c", legend_label="右に2")

# 上下反転
plot_function(lambda x: -(0.5 * x + 1), x_start=-6, x_end=6, target_plot=plot,
              line_color="#d62728", legend_label="上下反転")

# 左右反転
plot_function(lambda x: 0.5 * (-x) + 1, x_start=-6, x_end=6, target_plot=plot,
              line_color="#9467bd", legend_label="左右反転")

plot.legend.location = "top_left"
```

表とグラフを行き来して、式の変更がどの動きに対応するかを頭に刻もう。

#### ミニ課題
表の中から一つ選んで、自分で好きな \(f(x)\) を決めて動かしてみよう。どの変換が一番覚えやすい？

### 質問タイム
1. \( y = f(x - h) \) と \( y = f(x) - h \) はどちらが左右移動？
2. 上下反転と左右反転を同時にすると、どんな形になる？

### 振り返り
- [ ] 表を見なくても、上下移動と左右移動の式を言える？
- [ ] 反転の式を見て、グラフがどう動くかイメージできる？

### 発展
三角関数や指数関数でも同じ表が使える。身近な波形や増加・減少のグラフに当てはめてみよう。
