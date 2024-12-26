# バリデーションガイドライン

## 概要
アプリケーションにおけるバリデーションの実装方針について説明します。
クライアントサイドとサーバーサイドの両方でバリデーションを実装することで、セキュリティと使いやすさを両立させます。

## バリデーションの層分け

### 1. クライアントサイド（page.tsx）
フロントエンドでの即時フィードバック用の基本的なバリデーションを実装します。

```typescript
const handleUpdateUserInfo = async (field: string, newValue: string) => {
  // 入力値の基本チェック
  if (field === 'userName') {
    if (!newValue.trim()) {
      alert('ユーザー名を入力してください');
      return;
    }
    if (newValue.length > 50) {
      alert('ユーザー名は50文字以内で入力してください');
      return;
    }
  }

  // バリデーション通過後、サーバーアクションを呼び出し
  try {
    startTransition(async () => {
      await updateAction({ ...userInfo, [field]: newValue });
    });
  } catch (err) {
    console.error(err);
  }
};
```

### 2. サーバーサイド（actions.ts）
セキュリティに関わる本質的なバリデーションを実装します。

```typescript
export const updateUserInfo = async (
  prevState: ActionState, 
  updatedInfo: UserInfo
): Promise<ActionState> => {
  // 認証チェック
  const session = await auth();
  if (!session?.user?.email) {
    return {
      status: "error",
      message: "認証されていません",
    };
  }

  // 必須項目のバリデーション
  if (!updatedInfo.userName?.trim()) {
    return {
      status: "error",
      message: "ユーザーネームを入力してください",
    };
  }

  // その他のバリデーション
  if (updatedInfo.userName.length > 50) {
    return {
      status: "error",
      message: "ユーザーネームは50文字以内で入力してください",
    };
  }

  try {
    const updatedUser = await prisma.user.update({...});
    return {
      status: "success",
      data: updatedUser,
      message: "更新が完了しました"
    };
  } catch (error) {
    return {
      status: "error",
      message: "更新に失敗しました"
    };
  }
};
```

## バリデーションの責務分担

### クライアントサイドで実装すべきバリデーション
- 入力値の基本チェック（空文字、文字数など）
- 形式チェック（メールアドレス形式など）
- 即時フィードバックが必要なもの

### サーバーサイドで実装すべきバリデーション
- 認証・認可
- ビジネスロジックに関する検証
- データの整合性チェック
- セキュリティに関わる検証

## 推奨する理由

### 1. セキュリティ
- サーバーサイドでの検証は必須（クライアントサイドの検証は回避可能）
- 重要なビジネスロジックはサーバーサイドで保護

### 2. ユーザー体験（UX）
- クライアントサイドでの即時フィードバック
- 不要なサーバーリクエストの削減

### 3. 保守性
- バリデーションロジックの集中管理（サーバーサイド）
- クライアントサイドは最小限の検証のみ

## エラーメッセージの管理
<!-- TODO エラーメッセージの管理方法を検討 -->

## バリデーションルールの追加・変更

1. サーバーサイドのバリデーションルールを更新
2. 必要に応じてクライアントサイドのバリデーションも更新
3. エラーメッセージを定数として管理
4. 変更内容をドキュメントに反映

## 参考資料
- [Next.js Server Actions](https://nextjs.org/docs/app/api-reference/functions/server-actions)
