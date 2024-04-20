import { Dispatch, SetStateAction } from 'react'
import { Pagination } from 'react-bootstrap'
import styles from './index.module.scss'

interface PaginationProps {
  items: Array<any>
  itemsPerPage: number
  paginationMaxDisp: number
  currentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
}

const _Pagination: React.FC<PaginationProps> = ({
  items,
  itemsPerPage,
  paginationMaxDisp,
  currentPage,
  setCurrentPage,
}) => {
  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  let startPage: number, endPage: number
  if (currentPage <= 3) {
    startPage = 1
    endPage = Math.min(paginationMaxDisp, totalPages)
  } else if (currentPage > totalPages - 2) {
    startPage = Math.max(1, totalPages - 4)
    endPage = totalPages
  } else {
    startPage = currentPage - 2
    endPage = currentPage + 2
  }
  const pages = [...Array(endPage + 1 - startPage).keys()].map(
    (i) => startPage + i
  )

  // tsx.
  return (
    <div className={styles.pagination}>
      <Pagination>
        <Pagination.First
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        />

        {pages.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Pagination.Item>
        ))}

        <Pagination.Next
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  )
}

export default _Pagination
