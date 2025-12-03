# 第7章 三次関数
## 7.4 Pythonで近似直線を描いてみる（手計算版）

### 説明＆コード
中学レベルでもできる「手づくり回帰直線」を体験しよう。2点を選んでその間を結ぶだけでも、ざっくりした近似になる。

```python
x_vals = [0, 1, 2, 3, 4, 5, 6]
y_vals = [0.5, 1.0, 1.8, 2.7, 3.5, 4.2, 6.0]

plot = new_plot(title="手づくり回帰直線", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# データ点
plot_points(x_vals, y_vals, target_plot=plot, size=10, color="#1f77b4", legend_label="データ")

# 2点を選ぶ（例：最初と最後の点）
x1, y1 = x_vals[0], y_vals[0]
x2, y2 = x_vals[-1], y_vals[-1]

slope = (y2 - y1) / (x2 - x1)
intercept = y1 - slope * x1

plot_function(lambda x: slope * x + intercept, x_start=-1, x_end=7, target_plot=plot,
              line_color="#d62728", legend_label="2点で作った線")
plot.legend.location = "top_left"
```

2点だけで作った線だけど、データの真ん中をそこそこ通っているはず。傾き計算 \( a = \frac{y_2 - y_1}{x_2 - x_1} \) が鍵だね。

#### ミニ課題
2点の選び方を「最初と真ん中」「真ん中と最後」に変えてみよう。傾きと切片がどう変わるか計算して、グラフで比べてみて。

### 質問タイム
1. 傾きはどの式で計算する？
2. 切片は傾きとどんな関係で求める？

### 振り返り
- [ ] 2点から直線の式を立てる手順を覚えた？
- [ ] データの端を使うか真ん中を使うかで、線がどう変わるか説明できる？

### 発展
3点以上の平均を取って傾きを決める方法もある。簡単な平均を自分で考えて、もう少し精度を上げた線を作ってみよう。
