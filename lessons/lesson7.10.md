# 第7章 三次関数
## 7.10 まとめ：データと関数の距離を縮めよう

### 説明＆コード
散布図から始めて、直線を引き、誤差を見て、少し自動計算もやったね。これらは全部「データと関数の距離を縮める」作業。二次関数や三次関数に進むと、直線では足りないカーブを使ってもっとピタッと合わせられるようになる。

最後に、データと自動計算した直線を重ねたシンプルなコードを置いておくよ。

```python
import numpy as np

data_x = np.array([0, 1, 2, 3, 4, 5, 6], dtype=float)
data_y = np.array([0.5, 1.0, 1.8, 2.7, 3.5, 4.2, 6.0], dtype=float)

# 平均を使った簡易計算
a = ((data_x * data_y).mean() - data_x.mean() * data_y.mean()) / ( (data_x ** 2).mean() - (data_x.mean())**2 )
b = data_y.mean() - a * data_x.mean()

plot = new_plot(title="データと近似直線", width=600, height=400)
plot.xaxis.axis_label = "x"
plot.yaxis.axis_label = "y"

plot_points(data_x.tolist(), data_y.tolist(), target_plot=plot, size=10, color="#1f77b4", legend_label="データ")
plot_function(lambda x: a * x + b, x_start=-1, x_end=7, target_plot=plot,
              line_color="#d62728", legend_label="近似直線")
plot.legend.location = "top_left"
```

データと線の距離が近づくと、「関数がデータを説明している」実感が湧くはず。次はカーブも使って、もっとぴったりなモデルを探そう。

#### ミニ課題
三次関数っぽいデータ（S字カーブ）を自分で作って散布図を描いてみよう。直線ではどれくらいズレるか、二次関数ならどうか予想してみてね。

### 質問タイム
1. 近似直線を描く目的は何？
2. カーブを使う必要が出てくるのはどんなデータ？

### 振り返り
- [ ] データと関数の「距離」を小さくするイメージをつかめた？
- [ ] 次に二次関数・三次関数で何をしたいかイメージできる？

### 発展
機械学習や統計では、もっと複雑な関数でデータを説明する。ニュースで聞く「AIの予測」も、基本は今日学んだ「データに合う関数探し」なんだと意識してみよう。
