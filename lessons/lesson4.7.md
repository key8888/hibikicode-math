# 第4章 一次関数
## 4.7 交点のアニメーション観察

### 説明＆コード
1本の直線の傾きを動かし、別の固定直線との交点がどう動くかを観察しよう。交点が「解」であり、パラメーターを変えると解が滑らかに動くことがわかる。

```python
from bokeh.models import Slider, CustomJS

plot = new_plot(title="交点の動き", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

# 固定直線 y = x + 1
plot_function(lambda x: x + 1, x_start=-5, x_end=5, target_plot=plot,
              line_color="#1f77b4", legend_label="y = x + 1")

# 動かす直線 y = a x - 1 （初期 a = -1）
source_line = ColumnDataSource(data=dict(x=[-5, 5], y=[-5*-1 - 1, 5*-1 - 1]))
plot.line('x', 'y', source=source_line, color="#d62728", line_width=3,
          legend_label="y = a x - 1")

# 交点を計算するデータ
source_point = ColumnDataSource(data=dict(x=[1], y=[2]))
plot.circle('x', 'y', source=source_point, size=12, color="#9467bd",
            legend_label="交点")
plot.legend.location = "top_left"

slope_slider = Slider(start=-3, end=3, value=-1, step=0.1, title="動く直線の傾き a")

callback = CustomJS(args=dict(line_source=source_line, point_source=source_point, s=slope_slider), code="""
    const a = s.value;
    const x_vals = [-5, 5];
    const y_vals = x_vals.map(x => a * x - 1);
    line_source.data = {x: x_vals, y: y_vals};

    // 交点: a x - 1 = x + 1 -> (a-1)x = 2 -> x = 2/(a-1)
    const x_int = 2 / (a - 1);
    const y_int = x_int + 1;
    point_source.data = {x: [x_int], y: [y_int]};
    line_source.change.emit();
    point_source.change.emit();
""")

slope_slider.js_on_change("value", callback)
```

スライダーを動かすと交点がスーッと動く。方程式の解がパラメーターに応じて変わるイメージをつかもう。

#### ミニ課題
固定直線を `y = 2x` に変えてみよう。交点の動きはどう変わる？

### 質問タイム
1. 傾きが1に近づくと、交点の位置はどうなる？（ヒント: 分母が小さくなる）
2. 傾きが1と同じとき、交点は存在する？

### 振り返り
- [ ] 交点がパラメーターとともに動く様子を確認できた？
- [ ] 解がなくなる状況をグラフで見られた？

### 発展
一次関数だけでなく、他の関数との交点の動きも試してみよう。例えば二次関数と一次関数の交点がどう動くか調べると、パラメーターと解の関係がさらに深まるよ。
