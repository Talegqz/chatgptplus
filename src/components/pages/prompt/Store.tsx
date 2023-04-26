import { useSiteContext } from '@/contexts/site'
import { Avatar, Button, Card, Drawer, FloatButton, Input, InputRef, App, Popconfirm, Space, theme as antdTheme, Tooltip, Typography, Empty, Col, Row } from 'antd'
import { StarOutlined, StarFilled } from '@ant-design/icons'
import { useTranslation } from '@/locales'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Prompt } from '@/types/prompt'
import { usePromptContext } from '@/contexts/prompt'

function OnlinePrompt() {
  const router = useRouter()
  const { token } = antdTheme.useToken()
  const { theme } = useSiteContext()
  const { message, modal, notification } = App.useApp()
  const { promptList, starPrompt, unstarPrompt } = usePromptContext()
  const { t } = useTranslation()
  const [search, setSearch] = useState<string>('')
  const [list, setList] = useState<Prompt[]>([])

  useEffect(() => {
    searchRequest()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // 判断是否存在已经收藏过
    const _list = list?.map((item) => {
      let index = promptList.findIndex((tt) => item.uuid == tt.uuid)
      if (index > -1) {
        item.isStar = true
      }
      return item
    })
    setList(_list)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promptList])

  // 搜索请求
  const searchRequest = () => {
    console.log('searchRequest', search)
    // !todo 查询线上数据
    const _ll: any[] = []
    // 判断是否存在已经收藏过
    _ll.map((item) => {
      let index = promptList.findIndex((tt) => item.uuid == tt.uuid)
      if (index > -1) {
        item.isStar = true
      }
      return item
    })

    setList(_ll)
  }

  return (
    <div style={{ border: '0px solid #efeff5', flex: 1, padding: '16 16 0 16', display: 'flex', flexDirection: 'column', overflow: 'auto', width: '100%' }}>
      <div
        style={{
          height: 64,
          // borderRight: `${theme === 'dark' ? 0 : 1}px solid ${token.colorBorder}`,
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: theme == 'dark' ? token.colorBgContainer : '#fff',
          color: theme === 'dark' ? '#eee' : undefined,
          borderBottom: `1px solid ${theme == 'dark' ? '#424242' : '#e8e8e8'}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 9,
          right: 0,
          left: 0,
          padding: '16px',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Avatar shape={'circle'} size={42} style={{ padding: 4 }} src={<Image src={require('@/assets/openai.png')} width={42} height={42} alt="avatar" />} />
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
            <Typography.Paragraph style={{ fontSize: 16, width: '100%', fontWeight: 500, color: theme === 'dark' ? '#eee' : undefined, margin: 0 }}>
              {t('prompt.promptStoreTitle')}
            </Typography.Paragraph>
          </div>
        </div>
        <Space>
          <Space.Compact style={{ width: '100%' }}>
            <Input allowClear placeholder={t('prompt.searchPlaceholder') as string} value={search} onChange={(e) => setSearch(e.target.value)} onPressEnter={searchRequest} />
            <Button type="primary" onClick={searchRequest}>
              {t('prompt.search')}
            </Button>
          </Space.Compact>
        </Space>
      </div>
      <div id="messageBox" style={{ flex: 1, padding: '16 16 16 16', position: 'relative', overflowX: 'hidden', overflowY: 'auto' }}>
        {list.length <= 0 ? (
          <Empty style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}></Empty>
        ) : (
          <Row style={{ flexWrap: 'wrap', paddingLeft: 8, paddingTop: 8 }} gutter={[16, 16]}>
            {list.map((item: Prompt) => {
              return (
                <Col key={item.uuid} span={6} xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
                  <Card
                    size={'small'}
                    extra={
                      item.isStar ? (
                        <StarFilled style={{ color: token.colorWarning }} onClick={() => unstarPrompt(item.uuid)} />
                      ) : (
                        <StarOutlined style={{ color: token.colorTextDisabled }} onClick={() => starPrompt(item)} />
                      )
                    }
                    hoverable={true}
                    title={item.name}
                    bordered={true}
                    style={{ width: '100%' }}
                  >
                    <Typography.Paragraph ellipsis={{ expandable: true, rows: 2 }} copyable={false}>
                      {item.description}
                    </Typography.Paragraph>
                    <Typography.Paragraph ellipsis={{ expandable: true, rows: 2 }} copyable={{}}>
                      {item.prompt}
                    </Typography.Paragraph>
                    <Typography.Text style={{ fontSize: 12, color: token.colorTextDisabled }}>{item.dateTime}</Typography.Text>
                  </Card>
                </Col>
              )
            })}
          </Row>
        )}
        <FloatButton.BackTop
          style={{ marginBottom: 105, marginRight: 16 }}
          // @ts-ignore
          target={() => {
            return document.getElementById('messageBox')
          }}
        />
      </div>
    </div>
  )
}

export default OnlinePrompt
