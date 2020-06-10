# 2020 / Weekly Sync

## Details

Weekly sync meetings are a chance for active **@bokeh/dev** members to share technical updates about ongoing and planned work.

**Time:** Wednesdays @ 08:00 Pacific US time (UTC -08:00)

**Location:** https://meet.google.com/dtm-iycn-ctx?hs=122

**Minutes**
- HackMD: https://hackmd.io/@bokeh/HyYsdmvFI
- GitHub Archive: [minutes/Weekly Sync - 2020.md](https://github.com/bokeh/pm/blob/master/minutes/Weekly%20Sync%20-%202020.md)

## Links

* [June](#June)
* [May](#May)
* [April](#April)
* [March](#March)
* [February](#Februry)
* [January](#January)

## Template
```
## DD-MMM

*Attending:*

### Agenda
- item1
- item2
  - **Decision:**
  
### Updates

#### Name
- update1
- update2

### Actions
```

---

# June

* [10-Jun](#10-Jun)
* [03-Jun](#03-Jun)

## 10-Jun

*Attending: Bryan, Carolyn, Mateusz, Pavithra, Philipp*

### Agenda
- release branch?
- GH org Sponsors
- Release plans
    - rc2 out now, will release Monday
    - testing of release candidates/ docs
  
### Updates

#### Mateusz
- finalized work on bokehjs' unit tests and structural equality
- fixed regressions related to resizing and repainting canvas
- fixed image baseline tests broken by the release of Chrome 83
- added support for archiving (via artifacts) examples tests' output
- continued work on data management for color mappers and color bars
    - redesign of indexing; introduced `BitSet` data structure (WIP)

#### Bryan
- prepping release candidates

#### Philipp

- Started ipywidgets blog post
- Testing Colab integration

#### Carolyn
- old blog updated to point to Medium
- 2.1 blog post ready to go 
- Ayush's first post up!
- Starting on blog post covering GitHub sponsorship, ongoing, projects, org changes -- target for publication later next week

#### Pavithra
- Tiny PR for backdating medium blogs
- Some CZI research
- Getting back to FDV

### Actions
- [ ] (Mateusz) Make issue to discuss releasing from a release branch
- [ ] (Philipp) Make issue to discuss porting Panel Widgets
- [ ] *(Pavithra) Email to Sumana for grant writing help*

## 03-Jun

*Attending: Ayush, Bryan, Mateusz, Philipp*

### Agenda

- release this week
    - build RCs tomorrow
    - plan to announce next monday
  
### Updates

#### Mateusz
- implemented cached HTML layout
- fixed various issues around Tool.active
- fixed issues with resizing and clearing SVG canvas
- added support for menus to proxy toolbar
- more upgrades to Map/Set across the codebase 
- improvements to bokehjs' tests and structural equality
    - replacement for `chai`
    - `Equals` interface and `Symbol.equals`
    - make structural equality the default in tests
    - normalized and robustified assertions

#### Ayush

- Started working on measurement 
    - draft this week 
- Working on first blog

#### Philipp

- Running into some issues with ipywidgets_bokeh
  - Events not being processed in some scenarios; working on reproducible example
  - requirejs confusing notebook detection for Panel
  - External assets (e.g. icons/fonts) not loading
- Will look into Colab comms (got a minimal example working)

#### Bryan

- fix build issue where local built package was not used
    - still some issue with weird version being reported
- fixed transparent toolbar highlight for dark modes
- re-submitted mrocklin BaseServer -> BokehTornado PR

### Actions
- [ ] ***(Bryan) Set up CZI meetings with Jim and others***

### Actions

# May

* [27-May](#27-May)
* [20-May](#20-May)
* [13-May](#13-May)
* [06-May](#06-May)

## 27-May

*Attending: Ayush, Bryan, Carolyn, Mateusz, Pavithra*

### Agenda
- GH Org sponsorship
- PyCon India and Africa CFP open
    - [India](https://in.pycon.org/cfp/2020/proposals/) - CFP closes on 14th August
    - [Africa](https://africa.pycon.org/) - CFP closes on 5th June
- Code freeze for 2.1 -- Monday
  
### Updates

#### Bryan
- reworked mrocklins BaseServer PR
- working on cleaning up Github CI mess
- fix docs old/preview warning banner 
- lots triage/review/new contrib interaction

#### Carolyn
- would like to put up a Medium post about all our projects; will outline and ask for input from others
- how best to help with GSOD contributors?

#### Mateusz
- continued work on color bars and data flow/management in bokehjs
- more robust support for handling ndarray serialization
    - ndarrays can appear outside of ColumnarDataSource.data
    - binary/base64 encoding can be used (almost) everywhere
    - shapes are now handled on ndarray objects
- replaced setter/setter_id with a less verbose mechanism
- various improvements to widgets
    - slickgrid and flatpickr are properly destoryed
    - disabled property is now full respected
    - focus is maintaind across all widgets
- introduced "copy to clipboard" sub-action of save tool
- various code robustness improvements
    - dropped isStrictNaN
    - removed our custom Set type
    - substantially increased usage of Map and Set types
    - substantially reduced usage of for-in loop and in opreator

#### Pavithra
- Figured out how to backdate and import older blogs into medium
    - I'll try to do it this week

### Actions
- [ ] *(Pavithra) Email to Sumana for grant writing help*
- [ ] *(Phillip) open issue around improving pure Bokeh events*
- [x] *(Mateusz) make issue around SVG breakage*
- [x] (Carolyn) post on old blog redirecting to Medium
- [x] (Carolyn) write Medium post about ongoing projects
- [ ] ***(Bryan) Set up CZI meetings with Jim and others***

## 20 May

*Attending: Bryan, Jim, Mateusz, Pavithra, Philipp*

### Agenda

- 2.1 release target status
- get a couple bullet points for project updates for me to send to NumFocus for May (Carolyn)

### Updates

#### Bryan

- PyCon Mentored Sprints
- Lots of new PR review/triage
- GH Org sponsorship application

#### Mateusz

- fixed disabled property across widgets
- future branch changes are backported
- improving some internal data managing in BokehJS
    - supports color bar work
- fixed issues with webgl selections
- commited svg renderer and fixed rendering of circles

#### Philipp

- Mateusz merged my jupyter_bokeh PR for improving event handling
    - supports throttling, combining events
- Will work on blog post

#### Pavithra

- organized participated in Mentored Sprints
- helping GSoD 

### Actions

- [ ] (Phillip) open issue around improving pure Bokeh events
- [ ] (Mateusz) make issue around SVG breakage
- [ ] *(Bryan) Set up CZI meetings with Jim and others*

## 13 May

*Attending: Ayush, Bryan, Carolyn, Mateusz, Pavithra, Philipp*

### Agenda

- Bokeh got accepted to Season of Docs!
    - Lots of new folks in Slack
- 2.1 release timeline
    - propose code freeze end of month (31st May)
    - next meeting talk about milestones
  
### Updates

#### Carolyn

- Lots of new great showcase examples
- working on Bokeh palette

#### Ayush 

- Looking at design of tools
- Setting up meeting schedules

#### Mateusz

- Backporting work from future branch
- PR to vendor SVG library 
- Looking at OS build issue
- Also still working on colorbars, etc

#### Pavithra

- PRs to highlight CoC
- Getting lots of things in the calendar

#### Philipp

- ipywidgets/jupyter work 
    - can run nbconvert on notebook w/ ipywidgets
- Working on blog post abotu juptyter integration

#### Bryan

- Finished PR for extra markers
- Infrastructure work - AWS
- Looking into Twitter and LinkedIn posts

### Actions

- [ ] (Bryan) Set up CZI meetings with Jim and others
- [ ] (Pavithra) Set up call with grant writer help -- [Sumana](https://www.harihareswara.net/)

## 06 May

*Attending: Ayush, Bryan, Carolyn, Mateusz, Pavithra, Philipp*

### Agenda
- AWS topics
    - Can ci.bokeh.org be retired?
    - Bokeh AWS account joined NF AWS org
- Org/governance updates
    - Carolyn joined NF committee
    - Codifying unanimous consent consensus model
- GSOC official announcement
- Some really nice showcases

### Updates

#### Bryan
- Started adding context and help to GFI issues
- Investigating options for CDN log data pipeline
- Updated some org documentation

#### Carolyn
- great new showcases; tweeting out this week MWF
- changes to Medium account to allow multiple writers. Will be in touch with Ayush to get set up for his GSOC blog contributions
- now able to do some Windows testing

#### Pavithra
- Filed the GSoD Application
- New HackMD note

#### Ayush

- Start looking at issues and prioritizing
- Set up kickoff meeting

#### Mateusz
- Merged new testing framework (image baselines in the repo)
- Experimental work on generalized canvas positioning (next week)
- Allow to use different box select modes without keyboard
- Support for toolbar button context menus
- Working on watch mode for dev

#### Philipp

- Ipywidgets/Jupyter integration work
    - Some events remaining to implement
    - Working on adding throttling options
- Talking with Google Colab about providing comms

### Actions

- [ ] (Bryan, Philipp, Ayush) Schedule kick-off for GSOC 
- [x] (Ayush) Send link to Full GSOC proposal to Mateusz/Slack
- [x] (Pavithra) Set up a #grants/#czi Slack channel

# April

* [29-Apr](#29-Apr)
* [22-Apr](#22-Apr)
* [15-Apr](#15-Apr)
* [08-Apr](#08-Apr)
* [01-Apr](#01-Apr)

## 29 Apr

*Attending: Ayush, Bryan, Mateusz, Pavithra, Philipp, Ryan*

### Agenda

- 2FA for GitHub (update)
- PyCon US mentored sprints for diversity beginners
    - 17th May (4 hours), apply by 10th.

### Updates


#### Bryan

- Continued working on the PR on new marker types.
- Maybe look into WebGL in a month or so.
- Turned on TFA for GH
- Worked on release stuff

#### Pavithra

- GSOD application to submit by Friday

#### Mateusz

- Wrapping up color mapping and color bar PR by tomorrow
- PR on establishing painting engine
    - support gridplots on a single canvas
    - early, perhaps done in a few weeks

#### Ryan

- Working on some first issues

#### Ayush

- Ready to get started at GSOC start
    - 4th May

### Actions
- [ ] **(Mateusz) Look in to keeping OTP token turned for NPM**
- [ ] (Mateusz) Open an issue to discuss testing automation
- [x] (Bryan) Set up Google calendar for Project 
- [x] (Pavithra) Submit GSoD application by Friday

## 22 Apr

*Attending: Ayush, Bryan, Carolyn, James, Mateusz, Pavithra, Philipp*

### Agenda

- 2.0.2 retro
    - Will finalize release today
- JHU embed CDN spike
- CZI Round 3
- NumFocus SDG Round 2 
- 2FA for GitHub

### Updates

#### Philipp

- Testing with 2.0.2rc
- Starting on Jupyter blog post iywidgets

#### Pavithra

- Start working on application
    - Meeting on the 27th
- Starting GSOD Ideas wiki page

#### Carolyn

- 2.0.2 blog post draft on Medium, mostly ready to go, need ipywidgets screen shots?
- project updates due to NF today

#### Mateusz

- finalizing image diff tests
- multi-canvas renderer
- color bar/color mapping improvements

#### Bryan 

- Working on build release stuff
- Working on Slack integrations
- Working on markers

### Actions

- [x] **(Philipp) Comment on existing ipwidgets docs**
- [x] **(Philipp) Chase up Jim about ipywidgets blog post**
- [ ] **(Mateusz) Look in to keeping OTP token turned for NPM**
- [x] (Bryan) send out info to previous CZI proposal

## 15 Apr

*Attending: Bryan, Pavitha, Philipp, Ryan*

### Agenda

- Release 2.0.2
    - Plan cut release over weekend/announce on Monday
- Project/NF Sync meeting Friday
- GitGuardian 
- Slack
- Season of Docs
    - Org application is currently open

### Updates

#### Philipp
- testing django/windows fix
- created issue for token / secret cookies

#### Pavithra

- Looking into Season of Doc

#### Carolyn

- what can I do to be helpful with Ayush?
- align on plan for Fundamentals of Data Visualization notebooks
- Scipy 2020 virtual, anyone want to submit?

#### Mateusz

- Continuing working on colorbar
- Working on making bokehjs shadow DOM

#### Bryan 

- Little bit of clean-up: miniconda
- Added some missing release notes
- Continue working on release automation
- Working on new markers (for 2.1)

### Actions

- [x] (Bryan) Intentionally check GitGuardian on a smaller repo
- [x] (Pavithra) Create a Slack channel for Season of Docs
- [ ] **(Philipp) Comment on existing ipwidgets docs**
- [ ] **(Philipp) Chase up Jim about ipywidgets blog post**
- [ ] **(Mateusz) Look in to keeping OTP token turned for NPM**

## 08 Apr

*Attending: Bryan, Carolyn, Mateusz, Pavithra, Philipp*

### Agenda

- Slack / Delete Gitter and Zulip
    - bokeh-dev.slack.com
- GSoC slot request
- NPM tokens?
- Google Season of Docs

### Updates

#### Mateusz

* Working on bokehjs testing infrastrucure
  * `await view.ready` now waits for deferred rendering to finish
  * added tests for a few recent PRs merged without proper testing
  * image diff test infrastructure merged but not enabled yet due to unresolved platform differences
* Working on data-aware color bars
* Working on making bokehjs shadow DOM and web component compatible
* Allow to update `FactorRange.factors`
 
#### Philipp

* Fix Django Server by switching to CDN resources by default and then get proper fix in

#### Bryan

* 2 small PRs closed
* Slack setup
* GsoC things
* Working on automating releases

#### Carolyn

* Work on Jupyter blog post

### Actions

* [ ] *(Philipp) Comment on existing ipwidgets docs*
* [x] *(Pavithra) Add FDV Notebook for chapter 1*
* [ ] (Philipp) Chase up Jim about ipywidgets blog post
* [ ] (Mateusz) Look in to keeping OTP token turned for NPM
* [x] (Philipp) Create issue about token encryption and whitelisting cookies
* [x] (Bryan) Try to get shadow DOM complete example from Discourse user

## 01 Apr

*Attending: Bryan, Mateusz, Pavithra, Philipp*

### Agenda

- New hackmd note for April?
- GSoC review period
- Credential spill
- Release automation questions

### Updates

#### Philipp

- Look at Django integration (extend extension serving to Django)
- Experiments with multiple kernels for ipywidgets integrations

#### Mateusz

- Docs/widgets for ipywidgets
- Experiments with multiple kernels for ipywidgets integrations
- Fixed issue with reloading saved content
- Multiple BokehJs versions per page

#### Bryan

- 2.0.1 released
- Automation work releases
- Look at the GSoC ideas page
- Re-deployed demo site on Elastic Beanstalk

### Actions

* [x] (Bryan) this content to new April HackMD note
* [x] (Bryan) ping Chris Holdgraf about nbviewer 
    - issue ongoing, removed nbviewer.org links
* [x] (Bryan) reply above GSoC selection (before next meeting)
* [x] (Mateusz) Add issue about NPM publishing 
* [ ] (Philipp) Comment on existing ipwidgets docs
* [ ] (Pavithra) Add FDV Notebook for chapter 1

# March

* [25-Mar](#25-Mar)
* [18-Mar](#18-Mar)
* [11-Mar](#11-Mar)
* [04-Mar](#04-Mar)

## 25 Mar

*Attending: Carolyn, Mateusz, Philipp, Pavithra*

### Agenda

- (none today)

### Updates

#### Philipp

- Will try fix MultiChoice placeholder today
- Will investigate throttling in jupyter_bokeh 

#### Mateusz

- ipywidgets_bokeh
  - finished update to jlab 2.x
  - published version 1.0.0-dev.1
  - added support for binary protocol
- bokeh
  - `MessageSent` now supports binary buffers
  - added support for serving extensions' static files
  - started `future` branch to collect changes for bokeh 3.0

#### Carolyn

- Invitation to guest-post on Jupyter blog
- FDV notebook work still to do

#### Pavithra

- Progress on FDV Notebook

#### Bryan (post-meeting update)

- 2.0.1: hopefully rc today

### Actions

- [ ] (Mateusz) submit a PR to panel to make it npm publishable

## 18 Mar

*Attending: Bryan, Carolyn, Jim, Mateusz, Philipp, Pavithra*

### Agenda

- GH Security alerts
- 2.0.1 release plans

### Updates

#### Philipp

- Switched to Bokeh.require in HoloViews/GeoViews CustomJS callbacks; would be good to maintain compatibility for this in the future
- Would be good to document how to build a bokeh extension

#### Mateusz

- Made ipywidgets integration work with jupyter 2.0
- Progress on binary protocol

#### Carolyn

- started on FDV notebook work; a little behind, but it's going
- in touch with Ana about publicizing Jupyter integration; already went out with Tracking Jupyter newsletter, she has offered to tweet

#### Jim

- Anaconda's been in a lean phase, consulting-wise, but now there are lots of upcoming contracts. Less time to spend on fundamentals; switching to a feature mode rather than integration mode.

#### Bryan 

- Re-deployed 2.0 docs with SRI hashes

### Actions

- [ ] (Bryan) 2.0.1 release

## 11 Mar

*Attending: Bryan, Carolyn, Jim, Philipp*

### Agenda
- Release retro
    - Good response, no major problems so far 
- IPywidgets / process
    - look to have docs/examples in complete PRs
- Release cadence
    - quick cadence, 2.0.1 as soon as next week

### Updates

#### Philipp

- Working on compat upstream releases
    - running into conda issues

#### Mateusz

- Updated jupyter_bokeh
    - compat with Bokeh 2.0 and Jupyter 2.0
- Working on Ipywidgets improvements
    - Hopefully can avoid custom kernel parts
- Binary protocol improvements on hold but ongoing 

#### Carolyn

- Couple of LI posts to queue up
- Starting on Wilke work

#### Bryan 

- Need to restore automation for releases
- Want to get back to a faster release cadence
    - BokehJS that doesn't rely on GH
- no major problems with 2.0 release

### Actions

- [ ] (Bryan) shoot for 2.0.1 as soon as next week 
- [x] (Carolyn) identify opportunities to publicize Bokeh+jupyter integrations
- [x] (Carolyn) begin on Wilke translations

## 04 Mar

*Attending: Bryan, James, Mateusz, Pavithra, Philipp*

### Agenda
- Review milestone and release schedule
    - packages built
- Release Blog Post
- FDV notebooks

### Updates

#### Mateusz

- working on binary protocol, array class
- looking in to shadow DOM 

#### Bryan

- Release candidate
  - testing, fixed problems
  - todo: manual testing on windows
- Helping with the 2.0 blog post

#### Philipp

- Working on Bokeh compat issues for Panel and Holoviews

### Actions

- [ ] Release on Monday
- [x] (bryan) Leave comments on Chartify and PandasBokeh
- [ ] (mateusz, philipp) jupyter integration content
- [ ] (everyone) testing!

# Februry

* [26-Feb](#26-Feb)
* [19-Feb](#19-Feb)
* [12-Feb](#12-Feb)
* [05-Feb](#05-Feb)

## 26 Feb

*Attending: Bryan, Mateusz, Pavithra*

### Agenda
- Review milestone and release schedule
    - Release candidate out tonight
    - Plan release on Monday
- Tesla tweet 
- Porting layout performance improvements from Panel?
    - Matesuz decided not to do for this release

### Updates

#### Mateusz
- toolbar short term fixes
- working on test infrastructure 

#### Bryan
- Closed some PRs
    - BOKEH_VERSION-BOKEH_CDN_VERSON 
        - not working in general due to too-strict Resources checks
    - Date range slider issue fixed
    - Tooltips not displayed correctly - fixed
    - sdist package size reduced to 6Mb
    - Changed the refdocs to include inherited properties
    - Broken Bokeh commands removed

### Actions

- [ ] (Carolyn) finish 2.0 release post for Medium
- [ ] (Bryan) Get release candidate out tonight
- [ ] (Mateusz) Manual build and documentation updates

## 19 Feb

*Attending: Bryan, Carolyn, Jim, Mateusz, Pavithra, Philipp*

### Agenda
- Review milestone and release schedule
    - code freeze friday, release mid-week next
    - milestone list pruned
- GSOC Status/Updates 
- NumFocus SDG CFP
- Infrastructure Show and Tell
- Porting layout performance improvements from Panel?
    - Do plan to port over changes from Panel

### Updates

#### Mateusz
- bokeh.io export changes, in good shape now
- still WIP for resources
    - perhaps should wait until after 2.0

#### Carolyn
- Writing up release 2.0 blog post
    - Need screen shots, copy, etc for blog post
- Plan social media updates after GSOC launch announce
- Update to NF newsletter (due today)

#### Philipp
- Token PR merged
- Updating upstream projects for compatibility
- Get back to Multichoice PR and annoying Toolbar bug 
- Ask for PR review of template items

#### Bryan

- Bunch of small PRs this week, including removing broken bokeh commands (html, etc; json still works and was left in)
- PR to fix export png on OSX
- PR to clear warnings about weird use of super; cleaned up unit spec hierarchy
- PR to ensure that selenium is not used in common imports; added a test that selenium is not part of common imports
- Deleted custom.md template for issues
- Clarified scales hierarchy

### Actions

- [x] ***(Phillip) Merge MultiChooser PR***
- [x] *(Bryan and Mateusz) Write up cases for/against Black formatting*
- [ ] (Phillip) put back webdriver functions
- [ ] (Carolyn) finish 2.0 release post for Medium
- [x] (Carolyn) line up social media releases for GSOC

## 12 Feb

*Attending: Bryan, Mateusz, Pavithra, Phillip*

### Agenda
- Review milestone and release schedule
    - holding pattern for resources and token works
- GSOC Status/Updates 
    - "Getting to know" period opened, students showing up
- Post 2.0 release cadence
    - proposal: 4-6 week cadence for small 
        - Maybe create a BEP to describe intentions?

### Updates

#### Mateusz

- Testing PR in better shape 
    - visual differences limited to fonts
- Resources PR
    - hopefully done today
- Exports work PR 

#### Phillip

- Token PR mostly happy with 
    - Examples tests need to be fixed up
    - pull_session may need tests
    - also to figure out: consistent model ids across processes
- Migration work on downstream projects
    - running in to APIs that were broken but not documented
        - (decision) put back old functions possibly deprecated

#### Pavithra

- Tested "manual" dev builds
    - Conda/Pip package install/work as expected

#### Bryan 

- Pycascades sprints
    - 2-3 people stopped by, worked on examples and tutorials
    - Might get put in touch with a designer interested to work on cleaning pu our visual assets accrss the project (fingers crossed)
- Answered GSoC student queries
- Discourse updates
    - Waiting on new beta version to resolve a Google login issue (currently getting lots of email warnings from Google)
- Merged PR for removing test marks
    - Run tests now using directory e.g. `py.test tests/unit`

### Actions

- [ ] ***(Phillip) Merge MultiChooser PR***
- [x] *(Bryan and Mateusz) Write up cases for/against Black formatting*
- [ ] (Phillip) put back webdriver functions
- [x] (Bryan) Discuss GSOC publicity/etc with Carolyn

## 05 Feb

*Attending: Bryan, Mateusz, Pavithra*

### Agenda
- Review milestone and release schedule
    - One more day for Resources work + SRI hashes
    - Push schedule one week - code freeze next Monday, release following
- GSOC
    - No more edits to ideas list after today
- Applying Black formatting
    - Come to decision next meeting
- Pyladies Dashboard
    - No updates or further communication
    - Asked Phllip to ping one of their new contributors

### Updates

#### Mateusz

- Work to finish exporting on Chrome/FF across platforms
    - differences in lightness of pixels (e.g. due to font rendering)
    - can be reliably detected and accounted
    - otherwise pixel perfect diffs for checked-in browsers

- Working on resources refactor as highest priority
    - If not, will merge temprary SRI hash PR 

- Plan to move "examples integration" tests out of examples and in to integration

#### Bryan 

- PR to remove use of pytest marks 
    - need to fix up some tests that were failing (and skipped earlier

- Finished the PR for directory style apps being package 

- All directory style apps now have common/uniform README
    - still need to upload a few screenshots

- Updated the Jupyter docs section
    - added notebook.rst to point to new jupyter.rst

- More work to set up Zulip
    - set up Twitter, GitHub, Pingdom, Stack Overflow integrations

### Actions

- [ ] ***(Phillip) Merge MultiChooser PR***
- [x] (Bryan) Finish uploading README screenshots
- [x] (Pavithra) Test manual dev build
- [ ] (Bryan and Mateusz) Write up cases for/against Black formatting

# January

* [29-Jan](#29-Jan)
* [22-Jan](#22-Jan)
* [15-Jan](#15-Jan)
* [08-Jan](#08-Jan)

## 29 Jan

*Attending: Bryan, Carolyn, Mateusz, Pavithra, Phillip*

### Agenda
- Review milestone and release schedule
    - Code freeze coming Monday Feb 3
    - Tentative release date: Feb 10
- GSOC
    - Have until Feb 5 to edit Ideas list
- Applying Black formatting
    - Come to decision next meeting
- Pyladies Dashboard
    - Consider panel, maybe grant

### Updates

#### Phillip

- Panel release done
- MultiChoice PR needs tests 

#### Carolyn
- Graphics for NF annual report done and submitted

#### Mateusz

- Design of resources PR submitted (WIP)
    - try to have ready to test tomorrow
- Experimental work on tests and image test

#### Bryan 
- Working on PR for adding package imports; mostly done, needs tests
- Set up a webinar with Quansight around 2.0 release, scheduled for Feb 21st
- Setting up Zulip chat instance (replacing gitter); bokeh.zulipchat.com
- merged several PRs; suddenly a large support surge, staying on top of those
- just passed 1.2M package downloads! almost a million pip package downloads; surpassing conda 3:1

### Actions

- [ ] ***(Phillip) Merge MultiChooser PR***
- [x] ***(Bryan) Cut a manual dev build***
- [ ] (Mateus) Write up difficulties with Black formatter
- [x] (Bryan) Forward NF Dashboard email to others
- [x] (Bryan) Move some issues to new (version) milestone and report in email

## 22 Jan

*Attending: Bryan, Mateusz, Pavithra, Philipp*

### Agenda
- Review milestone and release schedule
- GSOC
- Tidelift (funds to go in to Bokeh NF account)
- CZI (deadline is Feb 4)
- Ipywidgets docs
    - *Decision: Jupyter chapter split into notebooks/ipywidgets*

### Updates

#### Mateusz
- Testing infra work and improvements
- Experiments with testing with headless FF
- Almost done with properties system PR
- Close to finishing grid plot work
- Started splitting up BokehJS, very large test
    - existing issue to discuss how to split out

#### Bryan 
- Work improve glyph method function signature
- Publish (draft) ideas list for GSOC 2020 
    - https://github.com/bokeh/bokeh/wiki/GSOC-2020-Ideas-Page
- Add CI version check 

#### Philipp
- No Bokeh updates (working on Panel release)

### Actions
- [ ] ***(Phillip) Merge MultiChooser PR***
- [ ] *(Bryan) Cut a manual dev build*
- [x] (Mateusz) Push preview of PRs

## 15 Jan

*Attending: Bryan, Mateusz, Pavithra, Phillip*

### Agenda
- Discuss milestone and release 
    - *Decision* Milestone was pruned, feature cutoff in two weeks

### Updates

#### Phillip
- no updates busy with PyViz
- new PR for node glyph type
- back to multi-chooser P

#### Mateusz
- published ipywidgets bokeh extension to anaconda.org
- unable to publish to PyPI (need broader token)
    - Bryan will update tokens (need issue)
- published BokehJS dev5
- will deprecate old package org at 2.0 on NPM
- writing documentation for jupyter extention

#### Bryan
* Merge py3.8 support PR
* CI also runs on push master
* Will merge recent PR about export PR
* Updated DatePicker PR, ready for merge
* Meeting with HackMD abut free team plan

### Actions

- [ ] *(Phillip) Merge MultiChooser PR*
- [x] *(Bryan) Make an issue about examples and integration test issues* [`#9597`](https://github.com/bokeh/bokeh/issues/9597)
- [x] (Mateusz, Bryan) Issue and fix for PyPI token
- [x] (Bryan) Add commits from old 3.8 PR to verify python version [`#9598`](https://github.com/bokeh/bokeh/pull/9598)
- [ ] (Bryan) Cut a manual dev build (~~merge NPM PR before~~)

## 08 Jan

*Attending: Bryan, Mateusz, Pavithra, Phillip*

### Agenda
* Switch to HackMD for collaborative notes

### Updates

#### Phillip
- Blocked on other package work
- Return to auth token work today
- MulitiChoice widget, include in separate bundle
    - *Decision: merge and plan to split later*
- Fullscreen PR decide on dependency
    - *Decision: continue work on prototype (other issues still) but try not to avoid dependency*

#### Mateusz
- Jupyter integration done (?)
    - extension still to be published
- Working on grid plots on single canvas 
    - looking at having annotations span all sub-canvases

#### Bryan
- Merged new contributor PRs
- Closed some small milestone PRs
- Cut new dev build with GH Actions / manually
- Checked on 3.8 build (Numba in defaults soon)
- Asked for feedback on Flatpickr / Date property

### Actions

- [ ] (Phillip) Merge MultiChooser PR
- [x] (Phillip) Review JLab widgets PR
- [x] (Bryan) Agenda to discuss 2.0 milestone
- [x] (Mateusz) Comment on Eugene's PR
- [x] (Bryan) Make an issue about examples and integration test issues
