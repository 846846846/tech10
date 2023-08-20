'use strict'
import { NextPage } from 'next'
import { useState, useEffect, useMemo } from 'react'
import { PencilFill, TrashFill, Icon } from 'react-bootstrap-icons'
import Pagination from 'react-bootstrap/Pagination'
import BsTable from 'react-bootstrap/Table'
import moment from 'moment'
import { MemoClass, APIType } from '../webapi/memo'
import Edit, { Memo } from './Edit'
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  ColumnDef,
} from '@tanstack/react-table'
import styles from '../styles/memo.module.scss'

moment.locale('ja') // localeを日本語に設定

type RowItem = Memo & {
  add: Icon
  delete: Icon
}

type ModalStatus = {
  show: boolean
  type: APIType
}

const Table = () => {
  // hooks.
  const [show, setShow] = useState<ModalStatus>({ show: false, type: 'update' })
  const [data, setData] = useState<Array<RowItem>>([])
  const [selectId, setSelectId] = useState('')

  const columnHelper = createColumnHelper<RowItem>()
  const columns = useMemo<ColumnDef<RowItem, any>[]>(
    () => [
      columnHelper.accessor('title', {
        header: 'タイトル',
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor('mainText', {
        header: '本文',
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor('add', {
        header: '',
        cell: (info) => {
          return (
            <span>
              <PencilFill
                id={info.row.original.id}
                onClick={handleShow}
                style={{ cursor: 'pointer' }}
              />
            </span>
          )
        },
      }),
      columnHelper.accessor('delete', {
        header: '',
        cell: (info) => (
          <span>
            <TrashFill
              id={info.row.original.id}
              onClick={handleDelete}
              style={{ cursor: 'pointer' }}
            />
          </span>
        ),
      }),
      columnHelper.accessor('updateAt', {
        header: '',
        cell: (info) => <span>{moment(info.getValue()).fromNow()}</span>,
      }),
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = new MemoClass()
        const res = await api.read()
        setData(res.data as Array<RowItem>)
      } catch (e) {
        console.error('Error fetching data', e)
      }
    }
    fetchData()
  }, [show])

  useEffect(() => {
    table.setPageSize(10)
  }, [table])

  // handler.
  const handleClose = () => {
    setShow({ show: false, type: 'update' })
  }
  const handleShow = (e: React.MouseEvent) => {
    setSelectId(e.currentTarget.id)
    setShow({ show: true, type: 'update' })
  }
  const handleDelete = (e: React.MouseEvent) => {
    setSelectId(e.currentTarget.id)
    setShow({ show: true, type: 'delete' })
  }

  const { pageSize, pageIndex } = table.getState().pagination

  return (
    <div className={styles.table}>
      <BsTable hover className={styles.bsTableCus}>
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
      </BsTable>
      <Pagination className={styles.pagination}>
        <Pagination.First
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        />
        <Pagination.Prev
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        />
        <Pagination.Ellipsis />
        {pageIndex !== 0 ? (
          <Pagination.Item onClick={() => table.setPageIndex(pageIndex - 1)}>
            {pageIndex}
          </Pagination.Item>
        ) : (
          <></>
        )}
        <Pagination.Item active={true}>{pageIndex + 1}</Pagination.Item>
        {pageIndex !== table.getPageCount() - 1 ? (
          <Pagination.Item onClick={() => table.setPageIndex(pageIndex + 1)}>
            {pageIndex + 2}
          </Pagination.Item>
        ) : (
          <></>
        )}
        <Pagination.Ellipsis />
        <Pagination.Next
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        />
        <Pagination.Last
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        />
      </Pagination>
      <Edit
        type={show.type}
        show={show.show}
        handleClose={handleClose}
        memo={data.find((item) => item.id === selectId)}
      />
    </div>
  )
}

export default Table
