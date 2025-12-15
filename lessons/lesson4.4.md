# 第4章 一次関数
## 4.4 傾き・切片をいじって動きを観察しよう

### 説明＆コード
Bokeh の `Slider` を使うと、値を動かしながらグラフの変化をリアルタイムで見られる。ここでは傾き \(a\) と切片 \(b\) をスライダーで操作し、\( y = ax + b \) の動きを体験しよう。

```python
from bokeh.models import Slider, CustomJS

plot = new_plot(title="傾きと切片のスライダー", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 初期値は a=1, b=0
source = ColumnDataSource(data=dict(x=[-5, 5], y=[-5, 5]))
plot.line('x', 'y', source=source, line_width=3, color="#1f77b4", legend_label="y=ax+b")
plot.legend.location = "top_left"

slope_slider = Slider(start=-3, end=3, value=1, step=0.1, title="傾き a")
intercept_slider = Slider(start=-5, end=5, value=0, step=0.5, title="切片 b")

callback = CustomJS(args=dict(source=source, a=slope_slider, b=intercept_slider), code="""
    const x_vals = [-5, 5];
    const y_vals = x_vals.map(x => a.value * x + b.value);
    source.data = {x: x_vals, y: y_vals};
    source.change.emit();
""")

slope_slider.js_on_change("value", callback)
intercept_slider.js_on_change("value", callback)
```

スライダーを動かすと、直線の傾きと位置が滑らかに変わる。パラメーターをいじる楽しさを味わおう。

#### ミニ課題
スライダーの範囲をもっと広げてみよう。`start` や `end` を変えると、どんな動きが試せる？

### 質問タイム
1. 傾きのスライダーを動かすと、直線はどの軸を中心に回転しているように見える？
2. 切片のスライダーを動かすと、直線はどう移動する？

### 振り返り
- [ ] スライダーで直線が動くのを確認できた？
- [ ] 傾きと切片の役割の違いを体で感じられた？

### 発展
料金表など「固定費 + 追加料金」の仕組みを、スライダーでモデル化してみよう。切片が固定費、傾きが追加料金になるよ。
