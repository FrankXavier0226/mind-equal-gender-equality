MindEqual — Gender & Mental Health Awareness Site
Central issue: how gender shapes mental health — women are diagnosed with
depression/anxiety far more often, men die by suicide at more than twice the
rate, and both gaps trace back to stigma and unequal violence rather than
biology alone.
What's in here
`src/App.jsx` — the full one-page site: hero, the issue, statistics, laws &
policy timeline, myth/fact flip cards, crisis hotlines, and a pledge form.
`src/App.css` — the whole design system: glassmorphism cards, animated
gradient blobs, hover color-shifting buttons, and the light/dark toggle.
No extra npm packages needed — motion and theming are done with plain CSS and
two small React hooks (`useReveal`, `useCountUp`).
Drop it into your project
Copy `App.jsx` and `App.css` into your `src/` folder (overwrite the
existing ones, or rename the component and import `<App />` wherever you
want it rendered).
Make sure your `index.html`/root render call still points at `<App />`.
`npm start` (or your usual dev command) — that's it, nothing else to
install.
Wiring the pledge form to Laravel
The "Take the pledge" form currently just simulates a network call. To save
signatures for real, add a route on the Laravel side, e.g.:

```php
// routes/api.php
Route::post('/pledges', [PledgeController::class, 'store']);
```

```php
// app/Http/Controllers/PledgeController.php
public function store(Request $request)
{
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'pledge' => 'required|boolean',
    ]);

    return Pledge::create($data);
}
```

Then in `App.jsx`, inside `Pledge()`'s `handleSubmit`, uncomment the `fetch`
call (it already points at `/api/pledges` with the right method/body) and
delete the `setTimeout` line above it.
Making it yours
Colors: everything runs off the CSS variables at the top of `App.css`
(`--violet`, `--teal`, `--coral`, `--bg`, etc.) — change those and the whole
site re-themes.
Content: the `STATS`, `LAWS`, `MYTHS`, `HOTLINES` and `REFERENCES`
arrays at the top of `App.jsx` are the only place you need to edit text —
swap in your own research or add more entries.
Sections: each section is its own small component (`Hero`, `Issue`,
`Stats`, `Laws`, `Myths`, `Help`, `Pledge`, `Footer`) so you can reorder,
remove, or add ones without touching the rest.
Sources used for the statistics and laws
WHO — Depression fact sheet
WHO — World Mental Health Today, 2025
WHO — Comprehensive Mental Health Action Plan 2013–2030
Republic Act No. 11036 — Philippine Mental Health Act
Republic Act No. 11313 — Safe Spaces Act
Philippine Department of Health — Mental Health Program
Aves, J.A., 2024 — Evolution and Efficiency of Mental Health Laws in the Philippines
Since this is content for a graded assignment, it's worth double-checking the
exact figures against the linked sources yourself before submitting — some of
these are rounded and a couple come from news coverage of official reports
rather than the reports directly.
