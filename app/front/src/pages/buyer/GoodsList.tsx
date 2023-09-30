'use strict'
import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { GoodsAPI } from '../../webapi/entity/goods'
import GlobalNav from '../../components/buyer/GlobalNav'
import styles from '../../styles/Buyer.module.scss'

// local type definition
type TableItems = Pick<Goods, 'id' | 'name' | 'price' | 'owner'>

/**
 *
 * @returns
 */
const GoodsList: NextPage = () => {
  // hooks.
  const [data, setData] = useState<Array<TableItems>>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const goodsApi = new GoodsAPI()
        const res = await goodsApi.readList()
        setData(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  // table.
  const columnHelper = createColumnHelper<TableItems>()
  const columns = [
    columnHelper.accessor('id', {
      header: '商品ID',
      cell: (info) => (
        <Link href={`/buyer/GoodsView?Id=${info.getValue()}`}>
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('owner', {
      header: '販売者',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: '商品名',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('price', {
      header: '商品価格',
      cell: (info) => info.getValue(),
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // tsx.
  return (
    <Container>
      <Row className={styles.row}>
        <GlobalNav />
        <Table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="table-light">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  )
}

export default GoodsList
