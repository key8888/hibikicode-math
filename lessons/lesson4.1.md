# 第4章 一次関数
## 4.1 一次関数の基本形と「傾き」の直感

### 説明＆コード
一次関数の基本形は \( y = ax + b \)。ここで
- **傾き** \(a\): $x$ を1増やしたとき、$y$ がどれくらい増えるか（または減るか）。
- **切片** \(b\): $x=0$ のときの $y$ の値。グラフが $y$ 軸とぶつかる高さ。

傾きは坂道の「角度」に似ている。$a$ が大きいと急な坂、小さいとゆるい坂。$a$ が負なら下り坂。コードでいくつかの傾きを描いてみよう。

```python
# いろいろな傾きをまとめて描く
plot = new_plot(title="傾きと切片のイメージ", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

slopes = [2, 1, 0.5, -1]
colors = ["#d62728", "#1f77b4", "#2ca02c", "#9467bd"]

for a, c in zip(slopes, colors):
    plot_function(lambda x, a=a: a * x, x_start=-5, x_end=5, target_plot=plot,
                  line_color=c, legend_label=f"a={a}, b=0")

# 切片だけ変えたパターン
plot_function(lambda x: x + 2, x_start=-5, x_end=5, target_plot=plot,
              line_color="#ff7f0e", legend_label="a=1, b=2")
plot.legend.location = "top_left"
```

`a=0` なら横線、`a` が正なら右上がり、負なら右下がりになるのを確認してみて。

#### ミニ課題
`slopes` リストに `3` を追加して、さらに急な直線を描いてみよう。どんな形になった？

### 質問タイム
1. 傾き \(a\) が0のとき、グラフはどんな線になる？
2. 切片 \(b\) を大きくすると、グラフ全体はどう動く？

### 振り返り
- [ ] 傾きと切片の意味を自分の言葉で書ける？
- [ ] 傾きが正・負・0のときのグラフの向きを言える？

### 発展
身近な坂道を思い出して、傾きが大きそうな場所・小さそうな場所を写真に撮り、線を引いて傾きのイメージを比べてみよう。
