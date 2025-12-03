# 第5章 一次関数で作る図形
## 5.1 複数直線でできる領域とは？

### 説明＆コード
一次関数の直線が2本以上あると、平面がいくつかの「領域」に分かれる。領域とは「この直線より上」「この直線より下」といった条件で区切られた部分のこと。

例として、\( y = x \) と \( y = -x + 4 \) で囲まれる部分を眺めてみよう。

```python
plot = new_plot(title="直線で分かれる領域", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

plot_function(lambda x: x, x_start=-1, x_end=5, target_plot=plot,
              line_color="#1f77b4", legend_label="y = x")
plot_function(lambda x: -x + 4, x_start=-1, x_end=5, target_plot=plot,
              line_color="#d62728", legend_label="y = -x + 4")
plot.legend.location = "top_left"
```

2本の直線で平面が三つの部分に分かれる。2本の交点を結ぶ線分の周りに三角形っぽい領域ができることを感じてみて。

#### ミニ課題
別の直線 `y = 2` を追加してみよう。領域は何個に増える？図を数えてみてね。

### 質問タイム
1. 直線1本で平面はいくつの領域に分かれる？
2. 直線2本の交点は領域の境界としてどんな役割をする？

### 振り返り
- [ ] 直線で平面が分割されるイメージを持てた？
- [ ] 交点が領域の形を決めることに気づけた？

### 発展
地図の境界線や道路を直線で近似してみると、どんな領域ができるか考えてみよう。簡単な「地図のモデル」を作れるかも。
