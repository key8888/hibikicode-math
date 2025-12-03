# 第5章 一次関数で作る図形
## 5.5 変化する図形シミュレーション

### 説明＆コード
直線の傾きや切片を変えると、作られる図形も変形する。ここでは2本の直線を動かし、できる三角形の形や面積がどう変わるか観察しよう。

```python
from bokeh.models import Slider, CustomJS

plot = new_plot(title="動く三角形", width=650, height=420)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 固定直線 y = 0
plot_function(lambda x: 0, x_start=-2, x_end=6, target_plot=plot,
              line_color="#2ca02c", legend_label="y = 0")

# 動く直線1: y = a1 x + 1
# 動く直線2: y = -a2 x + 4
line1 = ColumnDataSource(data=dict(x=[-2, 6], y=[-2 + 1, 6 + 1]))
line2 = ColumnDataSource(data=dict(x=[-2, 6], y=[-(-2) + 4, -(6) + 4]))
plot.line('x', 'y', source=line1, line_width=3, color="#1f77b4", legend_label="y = a1 x + 1")
plot.line('x', 'y', source=line2, line_width=3, color="#d62728", legend_label="y = -a2 x + 4")

# 頂点を保存するソース
verts = ColumnDataSource(data=dict(x=[1.5, 4, -1], y=[2.5, 0, 0]))
plot.patch('x', 'y', source=verts, color="#ffeda0", alpha=0.5, line_color="#9467bd",
           legend_label="三角形")
plot.legend.location = "top_left"

slider1 = Slider(start=0.5, end=2.5, value=1, step=0.1, title="直線1の傾き a1")
slider2 = Slider(start=0.5, end=2.5, value=1, step=0.1, title="直線2の傾き a2")

callback = CustomJS(args=dict(l1=line1, l2=line2, verts=verts, s1=slider1, s2=slider2), code="""
    const a1 = s1.value;
    const a2 = s2.value;
    const x_vals = [-2, 6];
    l1.data = {x: x_vals, y: x_vals.map(x => a1 * x + 1)};
    l2.data = {x: x_vals, y: x_vals.map(x => -a2 * x + 4)};

    // 交点を計算
    const x12 = (3) / (a1 + a2); // a1 x + 1 = -a2 x + 4 -> (a1 + a2)x = 3
    const y12 = a1 * x12 + 1;
    const x10 = ( -1) / a1; // a1 x + 1 = 0
    const x20 = (4) / a2;   // -a2 x + 4 = 0

    verts.data = {x: [x12, x20, x10], y: [y12, 0, 0]};
    l1.change.emit();
    l2.change.emit();
    verts.change.emit();
""")

slider1.js_on_change("value", callback)
slider2.js_on_change("value", callback)
```

スライダーを動かすと三角形が伸び縮みする。面積が大きくなったり小さくなったりする様子も感じてみて。

#### ミニ課題
傾きの範囲を広げたり、切片を変えたりして、三角形が消える（面積0になる）条件を探そう。

### 質問タイム
1. 三角形がつぶれて線になるのはどんなとき？
2. 2本の直線が平行になると、領域はどう変化する？

### 振り返り
- [ ] スライダーで図形が変わるのを確認した？
- [ ] 面積がゼロになる条件を探せた？

### 発展
三角形だけでなく、四角形や多角形でも同様の仕組みを試してみよう。パラメーターと面積の関係を表にまとめると、簡単な最適化問題の入り口になるよ。
