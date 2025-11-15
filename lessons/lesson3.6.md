# 第3章 最初のグラフ
## 3.6 二点をつなぐ直線をプロットするには？

### 説明＆コード
2つの点 $(x_1, y_1)$ と $(x_2, y_2)$ を結ぶ直線は、高校数学Iで学ぶ一次関数の考え方で表せる。直線の方程式は
\[
y = mx + b
\]
の形。傾き（かたむき） $m$ は $\displaystyle m = \frac{y_2 - y_1}{x_2 - x_1}$、切片（せっぺん） $b$ は $y_1 - mx_1$ で求まる。

コードでは `plot_function` を使って直線を引けるし、もっとシンプルに2点の座標をリストで渡して線を引くことも可能だよ。

```python
x_points = [1, 4]
y_points = [2, 5]

plot = new_plot(title="二点を結ぶ直線")

# 点をプロットしておく
plot_points(x_points, y_points, target_plot=plot, size=12, marker="circle", color="#d62728", legend_label="与えられた点")

# 直線の傾きと切片を計算
x1, x2 = x_points
y1, y2 = y_points
m = (y2 - y1) / (x2 - x1)
b = y1 - m * x1

# plot_function で直線を描画
def line_func(x):
    return m * x + b

plot_function(line_func, x_start=0, x_end=5, target_plot=plot, line_color="#1f77b4", legend_label=f"y = {m:.1f}x + {b:.1f}")
```

もう一つの方法として、`plot.line` メソッドを直接使うこともできる。

```python
plot = new_plot(title="plot.lineで直線")
plot.line(x_points, y_points, line_color="#2ca02c", line_width=3, legend_label="二点を結ぶ")
plot_points(x_points, y_points, target_plot=plot, size=12, marker="circle", color="#ff7f0e")
```

`plot.line` は与えられた順に線を引くだけだから、2点でも折れ線グラフっぽく描ける。`line_width` は線の太さ（後で詳しく）。

#### ミニ課題
自分で好きな2点を考えて、傾きと切片を計算し、`plot_function` で直線を描いてみよう。計算した式を凡例に表示できるかな？

### 質問タイム
1. 傾き $m$ が正のとき、直線はどんな向きに傾く？
2. `plot.line` と `plot_function` の使い分けをどう考えればいい？

### 振り返り
- [ ] 傾きと切片の求め方をノートに書いた？
- [ ] 直線を描画する2つの方法を区別できる？

### 発展
鉄道の路線図や地図アプリでは、地点を結ぶ直線や曲線がたくさん出てくる。GPSデータを手に入れたら、二点間を直線で結んでみて距離や角度を調べてみよう。
