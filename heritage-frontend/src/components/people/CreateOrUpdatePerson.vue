<template>
  <div>
    <section>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <h1>{{ head }}</h1>
        <v-text-field
          v-model="person.forname"
          :rules="nameRules"
          label="forname"
          :counter="10"
          required
        />
        <v-text-field
          v-model="person.surname"
          :rules="nameRules"
          label="surname"
          :counter="10"
          required
        />
        <div>
          <v-checkbox
            v-model="person.isAlive"
            label="isAlive"
          />
          <v-text-field
            v-model="person.birthdate"
            type="date"
            label="Birthday date"
          />

          <v-radio-group v-model="person.gender">
            <v-radio
              :label="'Female'"
              :value="'female'"
            />
            <v-radio
              :label="'Male'"
              :value="'male'"
            />
            <v-radio
              :label="'Divergent'"
              :value="'divergent'"
            />
          </v-radio-group>
          <v-file-input
            accept="image/*"
            label="File input"
            type="file"
            @change="setImageEvent"
          />
        </div>
        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="validate"
        >
          Save
        </v-btn>
      </v-form>
    </section>
  </div>
</template>

<script>

import repository from '../../repository'

export default {
	name: 'CreateOrUpdatePerson',
	mixins: [ repository ],
	props: {
		head: {
			type: String,
			default: 'Create a person'
		},
		presetPerson: {
				type: Object,
				default() {
				return {
					id: 0,
					forname: '',
					surname: '',
					birthdate: '1999-12-31',
					isAlive: false,
					gender: 'divergent'
				}
			}
		}
	},
	data() {
		return {
			valid: true,
			nameRules: [
			v => !!v || 'Name is required',
			v => v && v.length <= 10 || 'Name must be less than 10 characters',
			],
			menu: false,
			activePicker: null,
      imageEvent: undefined,
			person: {
					id: 0,
					forname: '',
					surname: '',
					birthdate: '1999-12-31',
					isAlive: false,
					gender: 'divergent',
          imagePath: ''
			}
		}
	},
	created() {
		this.person = this.presetPerson
	},
	methods: {
		create() {
			let data = { id: this.person.id, forname: this.person.forname, surname: this.person.surname, birthdate: this.person.birthdate, isAlive: this.person.isAlive, gender: this.person.gender }
			this.createPerson(data).then(response => {
				this.forname = this.surname = this.gender = '';
        console.log(this.person.id)
        console.log(response.rows[0].id)
        this.uploadImage(this.imageEvent, response.rows[0].id).then(imageResponse => {
          this.$emit('create', response.rows[0])
        })
			}).catch(err => console.log(err.message));
		},
    setImageEvent(e) {
      this.imageEvent = e
    },
    uploadImage(e, id) {
      console.log(e)
      let img = e.target.files[0]
      let formData = new FormData()
      formData.append('image', img)
      return this.sendImage(formData, id).then(response => {
        console.log(response.data)
        this.imagePath =
        this.$emit('image-uploaded')
      }).catch(err => console.log(err.message))
    },
		validate () {
			if(this.$refs.form.validate()) {
				this.create()
			}
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>