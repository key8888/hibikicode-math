# 第4章 一次関数
## 4.6 複数の直線と交点

### 説明＆コード
2本の一次関数
\[
\begin{aligned}
 y &= a_1 x + b_1,\\
 y &= a_2 x + b_2
\end{aligned}
\]
の交点は「2つの式が同時に成り立つ点」。計算では連立方程式を解いて求める。

ここでは式とグラフの両方で交点を確認しよう。

```python
plot = new_plot(title="2本の直線と交点", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 2本の直線
plot_function(lambda x: 2 * x + 1, x_start=-5, x_end=5, target_plot=plot,
              line_color="#1f77b4", legend_label="y = 2x + 1")
plot_function(lambda x: -x + 4, x_start=-5, x_end=5, target_plot=plot,
              line_color="#d62728", legend_label="y = -x + 4")

# 交点を計算
# 2x + 1 = -x + 4  ->  3x = 3  ->  x = 1,  y = 3
plot_points([1], [3], target_plot=plot, size=12, color="#9467bd",
            legend_label="交点 (1, 3)")
plot.legend.location = "top_left"
```

交点は「式が同じになる場所」。計算とグラフで位置が一致することを確かめよう。

#### ミニ課題
自分で2本の式を決めて、交点を計算し、グラフでも確認してみよう。傾きが同じ場合はどうなる？

### 質問タイム
1. 交点を求めるとき、なぜ2つの式を「＝」で結ぶの？
2. 傾きが等しい2本の直線は交点を持つ？持たない？

### 振り返り
- [ ] 計算で交点を求める手順を書けた？
- [ ] グラフと計算結果が一致するのを確認した？

### 発展
2本の直線が平行で交点を持たない場合、連立方程式はどうなるか調べてみよう。解なしの状況と結び付けて考えてみてね。
