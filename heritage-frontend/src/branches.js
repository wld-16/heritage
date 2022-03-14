export default {
	data() {
		return {
			processedBranches: []
		}
	},
	methods: {
		branchesWithPath(branches){
				return branches.map(branch => {
					branch.path = JSON.parse(branch.path)
					return branch
				})
		},
		branchesWithYPosition(branches){
			let index = 0
			return branches.map(branch => {
				let offset = this.calculateYOffset(branch.path, this.processedBranches, 0)
				let levels = this.calculateYPositionsWithParents(branch.path, [], offset)
				this.processedBranches = this.processedBranches.map(procBranch => {
					if(levels.map(pEntry => pEntry.name).includes(procBranch.name)){
						procBranch.parents = procBranch.parents.concat(...levels.filter(lBranch => lBranch.name === procBranch.name && !lBranch.parents.includes(...procBranch.parents)).map(lBranch => lBranch.parents))
						return procBranch
					} 
					return procBranch
				})
				this.processedBranches.push(...levels.filter(entry => !this.processedBranches.map(pEntry => pEntry.name).includes(entry.name)))
				index+=1
				branch.id = index
				return branch
			})
		},
		calculateYOffset(branch, processedBranches, index){
			const indexOf = processedBranches.map(pEntry => pEntry.name).indexOf(branch.forname + " " + branch.surname)

			if(indexOf === -1){
				if(branch.child === undefined){
					return 0
				} else {
					index += 1
					return this.calculateYOffset(branch.child, processedBranches, index)
				}
			} else {
				return processedBranches[indexOf].y - index
			}
		},
		calculateYPositionsWithParents(entry, returnList, index, parent){
				const name = entry.forname + " " + entry.surname + " " + entry.bday
				returnList.push({name: name, bday: entry.bday, y: index, parents: [parent]})
				index += 1
				if(entry.child !== undefined){
					return this.calculateYPositionsWithParents(entry.child, returnList, index, name)
				}
				return returnList
			},
	}
}