# 第2章 Pythonを復習しよう！
## 2.4 配列の追加・削除操作

### 説明＆コード
リストにあとから値を追加したり、消したりすることでデータを自由に扱えるようになる。ここでは代表的なメソッドをチェックしよう。

- `append(value)`: 一番うしろに値を足す
- `insert(index, value)`: 指定した位置に値を差し込む
- `pop(index)`: 指定した位置の値を取り出して削除（`index` を省略すると最後）
- `del リスト[index]`: 指定位置を削除する命令

```python
numbers = [10, 20, 30]
numbers.append(40)  # [10, 20, 30, 40]
numbers.insert(1, 15)  # [10, 15, 20, 30, 40]
removed = numbers.pop(2)  # 20を取り出して削除
print("削除された値:", removed)
del numbers[0]  # 先頭を削除
print(numbers)
```

これを使えば、数学のデータ整理も柔軟になる。例えば、テストの点数から欠席した人のデータを取り除く、みたいな感じだよ。

Bokeh の例として、`append` で点を増やしながら表示するデモを作ってみよう。

```python
x_points = [0, 1]
y_points = [0, 1]
plot = new_plot(title="点を追加していく")
plot_points(x_points, y_points, target_plot=plot, legend_label="最初の点")

# 追加してから再描画
x_points.append(2)
y_points.append(4)
plot_points(x_points, y_points, target_plot=plot, legend_label="追加後")
```

#### ミニ課題
`study_times = [30, 40, 35]` に `append` で50を足して、`insert` で先頭に25を入れてみよう。そのあと、`pop` で真ん中の値を取り出して `print()` し、残ったリストでグラフを描いてみて。

### 質問タイム
1. `append` と `insert` の違いって何？
2. `pop` した値を変数に入れておくとどんな良いことがある？
3. データを削除するときに注意したいことは？

### 振り返り
- [ ] リストに値を追加・削除する方法を確認できた
- [ ] Bokeh でデータを更新しながら描く感覚をつかんだ
- [ ] 疑問やメモを残した

### 発展
- テストの点数から平均より低い値だけを削除するプログラムを考えてみよう。
- リストを操作しながら、$y = x^2$ のデータをリアルタイムで更新する仕組みを想像してみよう。
