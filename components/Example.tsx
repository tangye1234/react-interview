import React, { useDeferredValue, useEffect, useRef } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { RepositoryOption, type Repository } from './RepositoryOption'
import { FaceSmileIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { StateTransition } from './StateTransition'
import { usePrevious } from '../hooks/use-previous'
import { useLocalStorage } from '../hooks/use-local-storage'
import { queryRepository } from '../services/repository'
import { HistoryOption } from './HistoryOption'

const durations = ['duration-150', 'duration-200', 'duration-[250ms]', 'duration-300', 'duration-[350ms]', 'duration-[400ms]', 'duration-[450ms]', 'duration-500', 'duration-[550ms]', 'duration-[600ms]', 'duration-[650ms]', 'duration-700', 'duration-[750ms]', 'duration-[800ms]']

export default function Example() {
  const [open, setOpen] = React.useState(false)

  // shotcut for meta + k
  useEffect(() => {
    if (open) {
      return
    }

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'k' && event.metaKey) {
        setOpen(true)
      }
    }
    document.addEventListener('keydown', onKeydown)
    return () => {
      document.removeEventListener('keydown', onKeydown)
    }
  }, [open])

  const [rawQuery, setRawQuery] = React.useState('')
  const q = rawQuery.toLowerCase().replace(/^[#>]/, '')
  const [repositories, setRepositories] = React.useState<Repository[]>([])
  const [loading, setLoading] = React.useState(false)
  const query = useDeferredValue(q)

  useEffect(() => {
    setLoading(true)
    const controller = new AbortController()
    const signal = controller.signal
    queryRepository(query, signal)
      .then(setRepositories)
      .catch(_ => {})
      .finally(() => {
        if (!signal.aborted) {
          setLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [query])

  const [history, setHistory] = useLocalStorage<string[]>('history', [])
  const repoLength = Math.min(repositories.length, 5)
  const historyLenegth = Math.min(history.length, 8)
  const previousRepoLength = usePrevious(repoLength) || 0
  const previousHistoryLength = usePrevious(historyLenegth) || 0
  const showHistory = repoLength === 0 && !loading && !rawQuery && history.length
  const repoDiff = Math.abs(repoLength - previousRepoLength) / 5
  const historyDiff = Math.abs(historyLenegth - previousHistoryLength) / 8
  const transitionDuration = showHistory ? durations[Math.round(historyDiff * durations.length)] : durations[Math.round(repoDiff * durations.length)]

  return (
    <Transition.Root
      show={open}
      as={React.Fragment}
      afterLeave={() => setRawQuery('')}
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-40 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-2xl shadow-slate-300/10 bg-slate-900/70 shadow-2xl ring-1 ring-sky-500 ring-opacity-5 backdrop-blur-xl backdrop-filter transition-all">
              <Combobox
                value=""
                onChange={(item: string) => {
                  if (item) {
                    window.open(item, '_blank')
                    setHistory(history => Array.from(new Set([item].concat(history))).slice(0, 10))
                    setRawQuery('')
                  }
                }}
              >
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-100 placeholder-gray-500 focus:ring-0 sm:text-sm focus:outline-0"
                    placeholder="Search GitHub repos..."
                    displayValue={() => rawQuery}
                    onChange={(event) => setRawQuery(event.target.value)}
                  />
                  {loading && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <Combobox.Options
                  static
                  className="max-h-80 scroll-py-10 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
                >
                  <li>
                    <h2 className="text-xs font-semibold text-gray-200">
                      {rawQuery.length || loading || repositories.length ? 'Repositories' : 'Recent searches'}
                    </h2>
                    <StateTransition state={[repoLength, loading, !rawQuery, history.length]}>
                      <ul
                        className={`-mx-4 mt-2 text-sm text-gray-700 space-y-0.5 transition-[height] ease-in-out ${transitionDuration}`}
                      >
                        {repositories.length ? repositories.map(repo => (
                          <Transition key={repo.id}
                            appear
                            show
                            enter="transition duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <RepositoryOption repo={repo} keyword={query} />
                          </Transition>
                        )) : loading ? (
                          <li className="px-4 py-2 bg-slate-900/20 rounded-lg text-center" key="loading">
                            <span className="text-gray-400">Searching for {rawQuery}...</span>
                          </li>
                        ) : rawQuery.length > 0 ? (
                          <li className="px-4 py-2 bg-slate-900/20 rounded-lg text-center" key="no-results">
                            <span className="text-gray-400">No results found</span>
                          </li>
                        ) : history.map(item => (
                          <Transition key={item}
                            show
                            enter="transition duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <HistoryOption link={item} onDelete={() => setHistory(history => history.filter(h => h !== item))} />
                          </Transition>
                        ))}
                      </ul>
                    </StateTransition>
                  </li>
                </Combobox.Options>
                <span className="flex flex-wrap items-center bg-slate-900/20 py-2.5 px-4 text-xs text-gray-400">
                  <FaceSmileIcon className="w-4 h-4 mr-1" />
                  Welcome to Zolplay&apos;s React Interview Challenge.
                </span>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
