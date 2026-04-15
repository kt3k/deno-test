## はじめに

Deno でライブラリを書くとき、標準の `Deno.test` を使ったテスト体験はとても良いです。

* 依存なしで書ける
* セットアップ・設定なし
* `t.step` が便利

一方で、ライブラリを npm パッケージとしても公開したいと思った場合、現実的には **Node.js 互換性の担保** が必要になりますが、そこで大きな問題が発生します。

## 問題: Deno で書いたテストが Node.js で動かない

Deno でテストを書くと、当然ながらこうなります:

```ts
Deno.test("example", () => {
  // ...
});
```

しかしこれはそのままでは Node.js 上で動きません。

結果として、

* Jest / Vitest に書き換える
* `Deno.test` を諦める
* JSR を使いづらい (ので Deno エコシステムも諦める)

つまり、**Node.js 互換性のために、Deno の開発体験を捨てる**ことになります。

## やりたかったこと

理想

> **Deno のテストをそのまま書いて、Node.js でも実行したい**

つまり

* テストは `Deno.test` で書く
* JSR をそのまま使う
* でも Node.js でも動く

## 解決: `deno-test`

そこで作ったのが `deno-test` です。

```bash
npx deno-test
```

これだけで、`deno test` とほぼ同じようにテストが実行されます。


## できること

### Deno.test がそのまま動く

```ts
Deno.test("sum", () => {
  // ...
});
```

→ 書き換え不要で Node.js 上でも実行できます


### t.step に対応

```ts
Deno.test("nested", async (t) => {
  await t.step("case1", () => {});
});
```

→ これもそのまま動きます


### JSR / import map が使える

```ts
import { assertEquals } from "jsr:@std/assert";
```

→ Node.js 上でもそのまま解決されます

また、`deno.json` に書いた import map もそのまま参照されます:

```json
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.19"
  }
}
```

```ts
import { assertEquals } from "@std/assert";
```

→ Deno で書いていたときと同じ import の書き方のまま動きます

## 仕組み

内部的には、いくつかの技術を組み合わせています。

### 1. JSR を Node.js で使う → @deno/loader

Deno の特徴の一つが `jsr:` スキームですが、これは Node.js ではそのままでは解決できません。また `deno.json` の `imports` に書いた import map も、Node.js はそのままでは理解しません。

そこで [`@deno/loader`](https://jsr.io/@deno/loader) を使い、

* `jsr:` import を Node.js で解決
* `deno.json` の import map を解決
* Deno と同じモジュール解決体験を提供

しています。

なお `@deno/loader` は Deno 公式がメンテナンスしているパッケージで、[`@deno/vite-plugin`](https://www.npmjs.com/package/@deno/vite-plugin) や [Fresh の Vite プラグイン(`@fresh/plugin-vite`)](https://jsr.io/@fresh/plugin-vite)でも利用されています。Node / Vite エコシステムから Deno の解決ルールを使うための基盤として、すでに実戦投入されているライブラリです。

---

### 2. Deno グローバルの再現 → `@deno/shim-deno-test`

Node.js には当然 `Deno` グローバルが存在しません。

そこで `@deno/shim-deno-test` を使って:

* `globalThis.Deno` を提供
* `Deno.test` API をエミュレート

しています。

---

### 3. テスト実行の実体 → `node:test` へのマッピング

実際のテスト実行は Node.js のネイティブテストランナーである `node:test` に委譲しています。

つまり:

* `Deno.test` → `node:test` に変換
* `t.step` → サブテストとしてマッピング

という形で、

> **Deno のテスト記法を Node.js の仕組みにブリッジしている**

構造になっています。

## 何が嬉しいか

### 1. Deno-first を維持できる

テストを書くときに (※ 少なくともテストコードに関しては):

* Node の事情を考えなくていい
* Jest / Vitest に寄せなくていい

→ **純粋に Deno の書き方で統一できる**

(なお、ライブラリ本体のコードについては、npm で配布する場合は Node.js の事情を考慮する必要があることには変わりません。`deno-test` が解決するのはあくまでテスト部分の開発体験です。)

---

### 2. npm パッケージでも問題ない

* Node.js 上でテストが通る
* CI にそのまま組み込める

→ **Deno 製ライブラリでも、Node.js の CI フローにそのまま乗せられる**

---

### 3. JSR と相性が良い

→ **JSR / Deno エコシステムのパッケージを、テストでそのまま使える**


## まとめ

* Deno で書いたテストを Node.js でも動かしたい
* そのために `deno-test` を作った
* `@deno/loader` によって JSR を解決
* `@deno/shim-deno-test` によって Deno API を再現
* `node:test` にマッピングして実行

## リポジトリ

https://github.com/kt3k/deno-test

