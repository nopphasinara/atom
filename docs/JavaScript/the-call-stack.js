handleSubmit = event => {
  event.preventDefault();
  console.log('Before create event')
  this.createEvent();
  console.log('After createEvent')
}
createEvent = () => {
  console.log('Making fetch request')
  return fetch('http://localhost:3001/events', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({event:
      {
        name: this.state.name,
        start_time: this.state.start_time,
        end_time: this.state.end_time,
        location: this.state.location,
        address: this.state.address,
        notes: this.state.notes,
        invited_user_ids: this.state.invited_user_ids,
      }
    })
  })
  .then(res => {
    if(res.ok) {
    console.log('successful response')
    return res.json()
  } else {
    return res.json().then(errors => Promise.reject(errors))
    }
  })
}
