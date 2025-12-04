"use client"

import { motion } from "framer-motion"
import { CVListHeader } from "./cv-list-header"
import { CVGrid } from "./cv-grid"
import { CVEmptyState } from "./cv-empty-state"
import { CvWithRelations } from "../actions/get-cv-for-current-user"

interface CvListProps {
  cvs: CvWithRelations[]
  disabledButton?: boolean
}

export function CVListPage({ cvs, disabledButton }: CvListProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <CVListHeader disabledButton={disabledButton} />
          {cvs.length > 0
            ? <CVGrid cvs={cvs} />
            : <CVEmptyState />}
        </motion.div>
      </div>
    </div>
  )
}
