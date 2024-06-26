export default function Question() {
  return (
    <>
      <div className="collapse collapse-open">
        <input type="radio" name="my-accordion-1" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          bug、配置出错怎么办？
        </div>
        <ul className="collapse-content list-inside list-decimal">
          <li>此产品尚未经过完整测试，如果遇到问题，给您带来不便，还请谅解😅</li>
          <li>一般是程序升级更改配置数据结构问题，在设置页其他选项，点击清除所有设置，或者删除应用程序重新安装</li>
          <li>欢迎邮件反馈给我602120734@qq.com</li>
        </ul>
      </div>
    </>
  );
}
