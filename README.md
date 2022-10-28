# Приложение для интеграции кошелька и формы доната в Tilda

## Запуск

Для управления зависимостями используется [pnpm](http://pnpm.io/)

```bash
pnpm install
# для правильного подключения (ссылок на картинки) необходимо при сборке указать публичный url, куда деплоиться приложение
pnpm build --base https://public-url.netlify.app/
```

## Подключение к Tilda

### Добавление скрипта к всему сайту

В настройках сайта в разделе "HTML-КОД ДЛЯ ВСТАВКИ ВНУТРЬ HEAD" добавить следующее:

```html
<script type="module" crossorigin defer src="https://public-url.netlify.app/index.js"></script>
<link rel="stylesheet" href="https://public-url.netlify.app/index.css" />
```

### Отображение кнопки Connect wallet

> Без этого блока скрипт не начинает работу (отображение балансов/формы донатов)

Кнопка рендериться в блок с id **walletConnectBlock**

### Отображение блока доната

Рендериться в блок с id **donationForm**

### Отображение количества токенов

Приложение ожидает две переменных на глобальном объекте window

```ts
declare global {
  interface Window {
    TOKENS_AMOUNT?: number;
    renderTokensBalances?: (tokensBalances: readonly number[]) => void;
  }
}
```

**TOKENS_AMOUNT** - количество токенов балансы, которых нужно запросить, начиная с 0го id в контракте.

В функцию **renderTokensBalances** прокидывается массив балансов (размер равен TOKENS_AMOUNT) из контракта для текущего кошелька. 0й токен умножен на 1e-18, так как считается fungible.

### Покупка SFT

Приложение слушает событие **hashchange**.

Для вызова покупкии необходимо нажать на якорную ссылку вида **#buy123**, где 123 - это id токена из контракта. Т.е. для подключения нового SFT достаточно добавить кнопку с **href="#buy1"** + добавить кнопку **connect wallet** на страницу.
