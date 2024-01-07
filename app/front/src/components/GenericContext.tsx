import React, { createContext, useContext, useState, ReactNode } from 'react'

interface GenericInfo {
  XXX: string
}

interface GenericInfoContextType {
  genericInfo: GenericInfo | null
  setGenericInfo: React.Dispatch<React.SetStateAction<GenericInfo | null>>
}

const GenericInfoContext = createContext<GenericInfoContextType | undefined>(
  undefined
)

interface GenericProviderProps {
  children: ReactNode
}

export const GenericInfoProvider: React.FC<GenericProviderProps> = ({
  children,
}) => {
  const [genericInfo, setGenericInfo] = useState<GenericInfo | null>(null)

  return (
    <GenericInfoContext.Provider value={{ genericInfo, setGenericInfo }}>
      {children}
    </GenericInfoContext.Provider>
  )
}

export const useGenericInfo = () => {
  const context = useContext(GenericInfoContext)
  if (context === undefined) {
    throw new Error('useGenericInfo must be used within a GenericInfoProvider')
  }
  return context
}
