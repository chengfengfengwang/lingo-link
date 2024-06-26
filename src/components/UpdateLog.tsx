

export default function UpdateLog () {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-bold">0.3.4 (2024-06-25)</div>
        <ul className="mt-2 list-inside list-decimal">
          <li>
            <a target="issues" className="underline" href="https://github.com/chengfengfengwang/lingo-link/issues/5">fix custom models.</a>
          </li>
        </ul>
      </div>
      <div>
        <div className="text-2xl font-bold">0.3.3 (2024-06-22)</div>
        <ul className="mt-2 list-inside list-decimal">
          <li>
            <a target="issues" className="underline" href="https://github.com/chengfengfengwang/lingo-link/issues/4">Added support for custom models.</a>
          </li>
        </ul>
      </div>
      <div>
        <div className="text-2xl font-bold">0.3.2 (2024-06-17)</div>
        <ul className="mt-2 list-inside list-decimal">
          <li>重构、优化项目</li>
          <li>单词不再每页请求，提供手动从远程更新选项</li>
          <li>增加问题反馈渠道</li>
        </ul>
      </div>
      <div>
        <div className="text-2xl font-bold">0.2.2 (2024-05-29)</div>
        <ul className="mt-2 list-inside list-decimal">
          <li>support <a target="_blank" className="underline" href="https://deeplx.owo.network/">DeepLX</a></li>
        </ul>
      </div>
      <div>
        <div className="text-2xl font-bold">0.2.1 (2024-05-9)</div>
        <ul className="mt-2 list-inside list-decimal">
          <li>support <a target="_blank" className="underline" href="https://www.deepseek.com/">DeepSeek</a> model</li>
        </ul>
      </div>
      <div>
        <div className="text-2xl font-bold">0.2.0 (2024-05-7)</div>
        <ul className="mt-2 list-inside list-decimal">
          <li>When you click the popup (the extension icon in the top right corner of the browser), its input field will be filled with your selected text.</li>
          <li>We have added a new community feature on the Vocabulary Notebook page. In our community, we encourage you to create your own sentences using your collected words. This will help you learn these words faster and more effectively.</li>
        </ul>
      </div>
      <div>
        <div className="text-2xl font-bold">0.1.1 (2024-04-15)</div>
        <ul className="mt-2 list-inside list-decimal">
          <li>Added Collins Dictionary.</li>
          <li>Support for separately setting word service and translation service.</li>
          <li>You can customize your AI prompt with {'{sentence}'}.</li>
          <li>Added screenshot feature (requires setting of Baidu General Standard Text Recognition token).</li>
        </ul>
      </div>
    </div>
  )
}
