import React from 'react'
import { Combobox } from '@headlessui/react'
import { classNames } from '../lib/utils'
import {
  CpuChipIcon, TrashIcon,
} from '@heroicons/react/24/outline'

export type HistoryOptionProps = {
  link: string
  onDelete: (link: string) => void
}

export function HistoryOption({ link, onDelete }: HistoryOptionProps) {
  return (
    <Combobox.Option
      value={link}
      className={({ active }) =>
        classNames(
          'flex flex-col cursor-default select-none justify-center px-4 py-2 space-y-1.5',
          active ? 'bg-indigo-300/20 text-white' : 'text-gray-300'
        )
      }
    >
      {({ active }) => (
        <section className="flex items-center">
          <CpuChipIcon
            className={classNames(
              'h-5 w-5 flex-none',
              active ? 'text-white' : 'text-gray-200'
            )}
            aria-hidden="true"
          />
          <span className="ml-1 font-bold flex-auto truncate">
            {link.replace('https://github.com/', '')}
          </span>
          <TrashIcon
            className={classNames(
              'h-4 w-4 flex-none',
              active ? 'text-white' : 'text-transparent'
            )}
            aria-label="Delete"
            role="button"
            onClick={e => {
              e.stopPropagation()
              onDelete(link)
            }}
          />
        </section>
      )}
    </Combobox.Option>
  )
}
