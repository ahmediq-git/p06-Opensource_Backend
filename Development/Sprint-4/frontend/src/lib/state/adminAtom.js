// import { atom  } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const adminAtom = atomWithStorage('jwt', null)