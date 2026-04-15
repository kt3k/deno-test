# Deno-first なテストを Node.js でも動かしたいので `deno-test` を作った

## はじめに

Deno でライブラリを書くとき、標準の `Deno.test` を使ったテスト体験はとても良いです。

* 依存なしで書ける
* セットアップ・設定なし
* `t.step` が便利

一方で、ライブラリを npm パッケージとしても公開したいと思った場合、現実的には **Node.js 互換性の担保** が必要になりますが、そこで大きな問題が発生します。

## 問題: Deno で書いたテストが Node.js で動かない

Deno でテストを書くと、当然ながらこうなります：

```ts
Deno.test("example", () => {
  // ...
});
```

しかしこれはそのままでは Node.js 上で動きません。

結果として、

* Jest / Vitest に書き換える
* `Deno.test` を諦める
* JSR を使いづらくなるので Deno エコシステムも諦める

つまり、**Node.js 互換性のために、Deno の開発体験を捨てる**ことになります。

---

## やりたかったこと

理想

> **Deno のテストをそのまま書いて、Node.js でも実行したい**

つまり

* テストは `Deno.test` で書く
* JSR をそのまま使う
* でも Node.js でも動く

---

## 解決：`deno-test`

そこで作ったのが `deno-test` です。

```bash
npx deno-test
```

これだけで、`deno test` とほぼ同じようにテストが実行されます。

---

## できること

### Deno.test がそのまま動く

```ts
Deno.test("sum", () => {
  // ...
});
```

→ 書き換え不要で Node.js 上でも実行できます

---

### t.step に対応

```ts
Deno.test("nested", async (t) => {
  await t.step("case1", () => {});
});
```

→ これもそのまま動きます

---

### JSR が使える

```ts
import { assertEquals } from "jsr:@std/assert";
```

→ Node.js 上でもそのまま解決されます

---

## 仕組み

内部的には、いくつかの技術を組み合わせています。

---

### 1. JSR を Node.js で使う => @deno/loader

Deno の特徴の一つが `jsr:` スキームですが、これは Node.js ではそのままでは解決できません。

そこで `@deno/loader` を使い、

* `jsr:` import を Node.js で解決
* Deno と同じモジュール解決体験を提供

しています。

---

### 2. Deno グローバルの再現 => `@deno/shim-deno-test`

Node.js には当然 `Deno` グローバルが存在しません。

そこで `@deno/shim-deno-test` を使って：

* `globalThis.Deno` を提供
* `Deno.test` API をエミュレート

しています。

---

### 3. テスト実行の実体 => `node:test` へのマッピング

実際のテスト実行は Node.js のネイティブテストランナーである `node:test` に委譲しています。

つまり：

* `Deno.test` → `node:test` に変換
* `t.step` → サブテストとしてマッピング

という形で、

> **Deno のテスト記法を Node.js の仕組みにブリッジしている**

構造になっています。

---

## 何が嬉しいか

### 1. Deno-first を維持できる

テストを書くときに：

* Node の事情を考えなくていい
* Jest / Vitest に寄せなくていい

→ **純粋に Deno の書き方で統一できる**

---

### 2. npm パッケージでも問題ない

* Node.js 上でテストが通る
* CI にそのまま組み込める

→ **配布と開発体験を両立できる**

---

### 3. JSR と相性が良い

* JSR パッケージをそのまま使える
* Node 互換性チェックにも使える

→ **JSR ベース開発の障壁が下がる**

---

## 本質的には何をやっているか

これは単なるテストツールというより：

> **ランタイム差異を吸収するレイヤー**

です。

通常は：

* 開発者が Node / Deno の違いを意識する

`deno-test` を使うと：

* ツールが差異を吸収する

---

## まとめ

* Deno で書いたテストを Node.js でも動かしたい
* そのために `deno-test` を作った
* `@deno/loader` によって JSR を解決
* `@deno/shim-deno-test` によって Deno API を再現
* `node:test` にマッピングして実行

---

## おわりに

Deno の開発体験はとても良いですが、Node.js との互換性が必要になる場面はまだ多いです。

そのときに：

> 「Node に合わせて書き方を変える」のではなく
> 「Node 側を合わせる」

というアプローチもありだと思っています。

---

## リポジトリ

https://github.com/kt3k/deno-test

---

フィードバックや Issue など歓迎です！

